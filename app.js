
/**
 * Module dependencies.
 */

var express = require('express') 
  io = require('socket.io'),
  json = JSON.stringify;

var app = module.exports = express.createServer();
app.version = '0.0.1';

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
  count++;
  client.broadcast(json({count: count}));
  client.send(json({count: count}));

  client.on('message', function(message) {
    // message
    message = JSON.parse(message);
    var reload  = message.reload ? true : false;
    var text    = (message.message && message.message.text) ? message.message.text : null;
    message = { 'message': { 'text':text }, 'reload':reload, 'version':app.version };
    client.broadcast(json(message));
    client.send(json(message));
  });
  client.on('disconnect', function() {
    // disconnect
    count--;
    client.broadcast(json({count: count}));
  });
});
