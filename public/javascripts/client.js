
$(function(){
var poilot = new Poilot();

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
  var div = $('<pre class="eval"></pre>');
  var expression  = $('<div class="expression"></div>');
  var result      = $('<div class="result"></div>');
  expression.text(message);
  div.append(expression);
  try {
    var evaluated = poilot.evalString(message);
    if (!evaluated) { evaluated = 'null'};
    result.text(evaluated.toLocaleString());
  } catch (e) {
    result.text(e.toString());
    result.addClass('error');
  }
  div.append(result);
  $('#chat').prepend(div);
}
var setVersionString = function(poilot) {
  $('.version').text('ver ' + poilot.version);
}

poilot.socket.connect();
poilot.socket.on('message', function(message) {
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
    } else if (message.error == 'message.too_short_interval') {
      div.text('送信間隔の短いメッセージが多数送信されています。意図したメッセージでない可能性があるためメッセージの送信がブロックされました。ページを再読み込みしてください。');
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
    poilot.socket.send(poilotUtils.json({message: {text: text}}));
    $(this.text).val('');
  }
  var exec = $(this.exec).val();
  if (exec) {
    poilot.socket.send(poilotUtils.json({exec: exec}));
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
  if (poilot.socket.connected) {
    dotCount = 0;
    $('.status span').text('connected');
  } else if (!poilot.socket.connected && poilot.socket.connecting) {
    dotCount++;
    var dot = '';
    for (var i = 0; i<dotCount; i++) {
      dot = dot + '.';
    }
    $('.status span').text('connecting' + dot);
    if (dotCount >= 4) {
      poilot.socket.connect();
      dotCount = 0;
    }
  } else if (!poilot.socket.connected && !poilot.socket.connecting) {
    $('.status span').text('disconnected');
    $('.count span').text('0');
    poilot.socket.connect();
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