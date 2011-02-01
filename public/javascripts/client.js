var socket;
$(function(){
socket = new io.Socket( location.hostname, { port:location.port} );
var json            = JSON.stringify;
var poilot          = {};
poilot.title        = 'Poilot';
poilot.blur         = false;
poilot.unReadCount  = 0;
poilot.currentTime  = null;

var appendMessage = function(message) {
  var div = null;
  var data = message.text;
  if (data.match(/　/m)) {
    div = $('<pre class="chatlog aa"></pre>');
    div.text(data);
  } else {
    div = $('<p class="chatlog"></p>');
    div.text(data);
    div.html(div.html().replace(/\n/mg, '<br/>').replace(/\s/mg, '&nbsp;'));
  }
  $('#chat').prepend(div);
}
var execMessage = function(message) {
  var div = $('<pre class="evaluated"></pre>');
  try {
    var evaluated = eval(message);
    if (!evaluated) { evaluated = 'null'};
    div.text(evaluated);
  } catch (e) {
    div.text(e.toString());
    div.addClass('error');
  }
  $('#chat').prepend(div);
}
var setVersionString = function(poilot) {
  $('.version').text('ver ' + poilot.version);
}

socket.connect();
socket.on('message', function(message) {
  message = JSON.parse(message);
  var div = null;
  
  if (!poilot.version) {
    poilot.version = message.version;
    setVersionString(poilot);
  }
  
  if (message.count) {
    $('.count span').text(message.count);
  }
  
  // $('title').text(poilot.version + " : " + message.version)
  if (poilot.version != message.version) {
    location.reload(false);
  }
  
  if (message.buffers) {
    var buf = null;
    for (var i=0; i<message.buffers.length; i++) {
      buf = message.buffers[i];
      if (buf.time > poilot.currentTime) {
        appendMessage(buf);
      }
    }
  }
  
  if (message.error) {
    div = $('<p class="error"></p>');
    if (message.error == 'message.too_long') {
      div.text('送信したメッセージが長過ぎます。');
    } else if (message.error == 'message.invalid') {
      div.text('送信したメッセージが何かおかしいです。リロードしてみてください。');
    }
    $('#chat').prepend(div);
  }
  
  if (message.exec) {
    execMessage(message.exec);
  }
  
  if (message.message && message.message.text) {
    if (poilot.blur) {
      poilot.unReadCount++;
    }
    if (message.message.time) {
      poilot.currentTime = message.message.time;
    }
    appendMessage(message.message);
    if (poilot.unReadCount > 0) {
      $('title').text('(' + poilot.unReadCount + ') ' + poilot.title);
    }
  }
});

var send = function(event) {
  var text = $(this.text).val();
  if (text) {
    var time = new Date().getTime();
    socket.send(json({message: {text: text, time: time}}));
    $(this.text).val('');
  }
  var exec = $(this.exec).val();
  if (exec) {
    socket.send(json({exec: exec}));
    $(this.exec).val('');
  }
  return false;
}

$('.sendForm').bind('submit', send);

$('a[href="#textForm"]').bind('click', function() {
  $('a[href="#textForm"]').closest('li').removeClass('disabled');
  $('a[href="#textAreaForm"]').closest('li').addClass('disabled');
  $('a[href="#execForm"]').closest('li').addClass('disabled');
  $('#textForm').removeClass('disabled');
  $('#textAreaForm').addClass('disabled');
  $('#execForm').addClass('disabled');
  return false;
});
$('a[href="#textAreaForm"]').bind('click', function() {
  $('a[href="#textAreaForm"]').closest('li').removeClass('disabled');
  $('a[href="#textForm"]').closest('li').addClass('disabled');
  $('a[href="#execForm"]').closest('li').addClass('disabled');
  $('#textAreaForm').removeClass('disabled');
  $('#textForm').addClass('disabled');
  $('#execForm').addClass('disabled');
  return false;
});
$('a[href="#execForm"]').bind('click', function() {
  $('a[href="#textAreaForm"]').closest('li').addClass('disabled');
  $('a[href="#textForm"]').closest('li').addClass('disabled');
  $('a[href="#execForm"]').closest('li').removeClass('disabled');
  $('#textAreaForm').addClass('disabled');
  $('#textForm').addClass('disabled');
  $('#execForm').removeClass('disabled');
  return false;
});

var dotCount = 0;
setInterval(function() {
  if (socket.connected) {
    dotCount = 0;
    $('.status span').text('connected');
  } else if (!socket.connected && socket.connecting) {
    dotCount++;
    var dot = '';
    for (var i = 0; i<dotCount; i++) {
      dot = dot + '.';
    }
    $('.status span').text('connecting' + dot);
    if (dotCount >= 4) {
      socket.connect();
      dotCount = 0;
    }
  } else if (!socket.connected && !socket.connecting) {
    $('.status span').text('disconnected');
    $('.count span').text('0');
    socket.connect();
  }
}, 1000);

$(window).bind('blur', function() {
  poilot.blur = true;
  // $('title').text('(0): ' + poilot.title);
});
$(window).bind('focus', function() {
  poilot.blur = false;
  poilot.unReadCount = 0;
  $('title').text(poilot.title);
});

});