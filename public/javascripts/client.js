var socket;
$(function(){
socket = new io.Socket( location.hostname, { port:location.port} );
var json = JSON.stringify;
var poilot = {};
poilot.title        = 'Poilot';
poilot.blur         = false;
poilot.unReadCount  = 0;

socket.connect();
socket.on('message', function(message) {
  message = JSON.parse(message);
  var div = null;
  
  if (!poilot.version) {
    poilot.version = message.version;
  }
  if (message.count) {
    $('.count span').text(message.count);
  }
  // $('title').text(poilot.version + " : " + message.version)
  if (poilot.version != message.version) {
    location.reload(false);
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
  if (message.message && message.message.text) {
    if (poilot.blur) {
      poilot.unReadCount++;
    }
    var data = message.message.text;
    if (data.match(/　/m)) {
      div = $('<pre class="chatlog aa"></pre>');
      div.text(data);
    } else {
      div = $('<p class="chatlog"></p>');
      div.text(data);
      div.html(div.html().replace(/\n/mg, '<br/>').replace(/\s/mg, '&nbsp;'));
    }
    $('#chat').prepend(div);
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
  return false;
}

$('.sendForm').bind('submit', send);

$('a[href="#textForm"]').bind('click', function() {
  $('a[href="#textForm"]').closest('li').removeClass('disabled');
  $('a[href="#textAreaForm"]').closest('li').addClass('disabled');
  $('#textForm').removeClass('disabled');
  $('#textAreaForm').addClass('disabled');
  return false;
});
$('a[href="#textAreaForm"]').bind('click', function() {
  $('a[href="#textAreaForm"]').closest('li').removeClass('disabled');
  $('a[href="#textForm"]').closest('li').addClass('disabled');
  $('#textAreaForm').removeClass('disabled');
  $('#textForm').addClass('disabled');
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