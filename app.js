
/**
 * Module dependencies.
 */

var express = require('express') 
  io = require('socket.io'),
  json = JSON.stringify;

var app = module.exports = express.createServer();
app.version = '0.0.7';

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

var socket  = io.listen(app);
var count   = 0;
var buffers = [];
socket.on('connection', function(client) {
  var createDefaultMessage = function() {
    var msg = {};
    msg.count   = count;
    msg.version = app.version;
    return msg;
  }
  client.execMessage = function(message) {
    var msg = createDefaultMessage();
    if (message.exec && message.exec.length < 1000) {
      msg.exec = message.exec;
    } else {
      msg.error = 'message.too_long';
    }
    this.broadcast(json(msg));
    this.send(json(msg));
  }
  client.sendMessage = function(message) {
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
        this.send(json(msg));
      } else {
        this.broadcast(json(msg));
        this.send(json(msg));
        if (buffers.length > 100) {
          buffers.shift();
        }
        buffers.push(msg.message);
      }
    }
  }
  
  count++;
  client.broadcast(json(createDefaultMessage()));
  var initialMessage = createDefaultMessage();
  initialMessage.buffers = buffers;
  client.send(json(initialMessage));

  client.on('message', function(message) {
    // message
    message = JSON.parse(message);
    if (message.message) {
      client.sendMessage(message);
    } else if (message.exec) {
      client.execMessage(message);
    }
    
  });
  client.on('disconnect', function() {
    // disconnect
    count--;
    client.broadcast(json(createDefaultMessage()));
  });
});
