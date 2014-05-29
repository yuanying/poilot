
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io');
var json = JSON.stringify;

//var app = module.exports = express();//express.createServer();
// module.exports = app;
module.exports = server;
app.version = '0.1.0';

var port = process.env.PORT || 3000;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  // app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  port = 80;
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
  app.listen(process.env.PORT || port);
  console.log("Express server listening on port %d", app.address().port)
}

var socket_io  = io.listen(server, {
  flashPolicyServer: false// ,
  //   transports: ['htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']
});
var count   = 0;
var buffers = [];
socket_io.sockets.on('connection', function(client) {
  client.invalidTime  = 0;
  client.invalid      = false;
  var createDefaultMessage = function() {
    var msg = {};
    msg.count   = count;
    msg.version = app.version;
    msg.time    = new Date().getTime();
    return msg;
  }
  client.sendErrorMessage = function(code) {
    var msg = createDefaultMessage();
    msg.error = code;
    this.emit('message', json(msg));
  };
  client.execMessage = function(message) {
    var msg = createDefaultMessage();
    if (message.exec && message.exec.length < 1000) {
      msg.exec = message.exec;
    } else {
      msg.error = 'message.too_long';
    }
    this.broadcast.emit('message', json(msg));
    this.emit('message', json(msg));
  }
  client.sendMessage = function(message) {
    var msg = createDefaultMessage();
    if (message && message.message) {
      if (message && message.message && message.message.text) {
        if (message.message.text.length < 1000) {
          msg.message = {};
          msg.message.text = message.message.text;
          msg.message.time = msg.time;
        } else {
          msg.error = 'message.too_long';
        }
      } else {
        msg.error = 'message.invalid';
      }
      if (msg.error) {
        this.emit('message', json(msg));
      } else {
        this.broadcast.emit('message', json(msg));
        this.emit('message', json(msg));
        if (buffers.length > 100) {
          buffers.shift();
        }
        buffers.push(msg.message);
      }
    }
  }
  
  count++;
  client.broadcast.emit('message', json(createDefaultMessage()));
  var initialMessage = createDefaultMessage();
  initialMessage.buffers = buffers;
  client.emit('message', json(initialMessage));

  client.on('message', function(message) {
    var currentTime = new Date().getTime();
    if (client.previousTime + 500 > currentTime) {
      client.invalidTime++;
    }
    client.previousTime = currentTime;
    
    if (client.invalidTime == 5 && client.invalid == false) {
      client.invalid = true;
      client.sendErrorMessage('message.too_short_interval');
      // setTimeout(function() {
      //   client.invalid = false;
      //   client.invalidTime = 0;
      // }, 10 * 1000);
    } else if (client.invalid == false) {
      // message
      message = JSON.parse(message);
      if (message.message) {
        client.sendMessage(message);
      } else if (message.exec) {
        client.execMessage(message);
      }
    }
    
  });
  client.on('disconnect', function() {
    // disconnect
    count--;
    client.broadcast.emit('message', json(createDefaultMessage()));
  });
});
