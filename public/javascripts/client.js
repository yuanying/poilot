var socket;
$(function(){
socket = new io.Socket( location.hostname, { port:location.port} );
var json = JSON.stringify;

socket.connect();
socket.on('message', function(message) {
  message = JSON.parse(message);
  if (message.count) {
    $('#count').text(message.count);
  }
  if (message.message) {
    var data = message.message.text;
    var div = null;
    if (data.match(/\n/m)) {
      div = $('<pre class="chatlog"></pre>');
    } else {
      div = $('<p class="chatlog"></p>');
    }
    div.text(data);
    $('#chat').prepend(div);
    $('#chat').scrollTop(1000000);
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

setInterval(function() {
  if (!socket.connected && !socket.connecting) {
    socket.connect();
  }
}, 1000)

});