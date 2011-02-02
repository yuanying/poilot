var poilotUtils = {
  json: JSON.stringify,
  blankFunction: function() {},
  createLocaleString: function(string) {
    return function() {
      return string;
    };
  },
  escape: function (string) {
    return string.replace(/</mg, '&lt;').replace(/>/mg, '&gt;').replace(/"/mg, '&quot;');
  },
  safeWindow : (function() {
    var safeWindow = {};
    for (k in window) {
      if (typeof window[k] == 'function') {
        safeWindow[k] = this.blankFunction;
      } else {
        safeWindow[k] = {};
      }
    }
    return safeWindow;
  })(),
  dummy: null
};

var Poilot = function() {
  this.socket = new io.Socket( location.hostname, { port:location.port} );
};
Poilot.prototype = {
  title        : 'Poilot',
  blur         : false,
  unReadCount  : 0,
  currentTime  : null,
  evalString: function(string) {
    var document = {};
    document.location = {};
    document.write    = this.write;
    var window = poilotUtils.safeWindow;
    window.document = document;
    window.alert    = this.alert;
    window.poilot   = this;
    window.$        = jQuery;
    with (window) {
      with (document) {
        with (this) {
          return eval(string);
        }
      }
    }
  },
  showImage: function(url) {
    var div = $('<div/>');
    div.html('<p><img src="' + poilotUtils.escape(url) + '" alt="" /></p>');
    $('#chat').prepend(div);
  },
  toLocaleString: function () {
    return '[' + this.title + ' ver. ' + this.version + ']';
  },
  reload: function() {
    location.reload(false);
  },
  write: function(string) {
    var div = $('<p class="document_write"></p>');
    div.text(string);
    $('#chat').prepend(div);
  },
  alert: function(string) {
    var div = $('<p class="window_alert"></p>');
    div.text(string);
    $('#chat').prepend(div);
  },
  help: function () {
    console.log(this);
    var helpMessage = '';
    for (k in this) {
      if (typeof this[k] == 'function') {
        if (k == 'help') {
          helpMessage += 'help() : Show this message.'
        } else {
          helpMessage += (k + '() : ');
          helpMessage += this[k].toLocaleString();
          helpMessage += '\n';
        }
      }
    }
    return helpMessage;
  }
};
Poilot.prototype.evalString.toLocaleString = poilotUtils.createLocaleString('Evaluate argument string.');
Poilot.prototype.showImage.toLocaleString = poilotUtils.createLocaleString('Show image from url.');
Poilot.prototype.toLocaleString.toLocaleString = poilotUtils.createLocaleString('Return locale string.');
Poilot.prototype.write.toLocaleString = poilotUtils.createLocaleString('Write string to chat log.');
Poilot.prototype.alert.toLocaleString = poilotUtils.createLocaleString('Alert string to chat log.');
Poilot.prototype.reload.toLocaleString = poilotUtils.createLocaleString('Reload all users page.');
Poilot.prototype.help.toLocaleString = function() {
  return Poilot.prototype.help();
};
