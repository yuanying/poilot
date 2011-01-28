$(function(){
var socket = new io.Socket( location.hostname, { port:location.port} );
var json = JSON.stringify;

socket.connect();
socket.on('message', function(message) {
  message = JSON.parse(message);
  if (message.count) {
    $('#count').text(message.count);
  }
  if (message.message) {
    var data = message.message;
    var date = new Date();
    date.setTime(data.time);
    var div = $('<p class="chatlog"></p>');
    div.text(data.text);
    $('#chat').prepend(div);
    $('#chat').scrollTop(1000000);
  }
});

var send = function(event) {
  var text = $('#text').val();
  if (text) {
    var time = new Date().getTime();
    socket.send(json({message: {text: text, time: time}}));
    $('#text').val('');
  }
  return false;
}

$('.sendForm').bind('submit', send);

});