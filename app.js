
/**
 * Module dependencies.
 */

var express = require('express') 
  io = require('socket.io'),
  json = JSON.stringify;

var app = module.exports = express.createServer();
app.version = '0.0.4';

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  // app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

// app.get('/', function(req, res){
//   res.render('index', {
//     locals: {
//       title: 'Express'
//     }
//   });
// });

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}

var socket = io.listen(app);
var count = 0;
socket.on('connection', function(client) {
  var createDefaultMessage = function() {
    var msg = {};
    msg.count   = count;
    msg.version = app.version;
    return msg;
  }
  var sendMessage = function(message) {
    var msg = createDefaultMessage();
    if (message && message.message) {
      if (message && message.message && message.message.text && message.message.time) {
        if (message.message.text.length < 1000) {
          msg.message = {};
          msg.message.text = message.message.text;
          msg.message.time = message.message.time;
        } else {
          msg.error = 'message.too_long';
        }
      } else {
        msg.error = 'message.invalid';
      }
      if (msg.error) {
        client.send(json(msg));
      } else {
        client.broadcast(json(msg));
        client.send(json(msg));
      }
    }
  }
  
  count++;
  client.broadcast(json(createDefaultMessage()));
  client.send(json(createDefaultMessage()));

  client.on('message', function(message) {
    // message
    message = JSON.parse(message);
    sendMessage(message);
  });
  client.on('disconnect', function() {
    // disconnect
    count--;
    client.broadcast(json(createDefaultMessage()));
  });
});
