var poilotUtils = {
  json: JSON.stringify,
  blankFunction: function() {},
  createLocaleString: function(string) {
    return function() {
      return string;
    };
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

var poilot = {
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
    div.html('<img src="' + url + '" style="max-width:100%;height:auto;" />');
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
    var helpMessage = '';
    for (k in poilot) {
      if (typeof poilot[k] == 'function') {
        if (k == 'help') {
          helpMessage += 'help() : Show this message.'
        } else {
          helpMessage += (k + '() : ');
          helpMessage += poilot[k].toLocaleString();
          helpMessage += '\n';
        }
      }
    }
    return helpMessage;
  }
};

poilot.evalString.toLocaleString = poilotUtils.createLocaleString('Evaluate argument string.');
poilot.showImage.toLocaleString = poilotUtils.createLocaleString('Show image from url. (currently unsafe)');
poilot.toLocaleString.toLocaleString = poilotUtils.createLocaleString('Return locale string.');
poilot.write.toLocaleString = poilotUtils.createLocaleString('Write string to chat log.');
poilot.alert.toLocaleString = poilotUtils.createLocaleString('Alert string to chat log.');
poilot.reload.toLocaleString = poilotUtils.createLocaleString('Reload all users page.');
poilot.help.toLocaleString = function() {
  return this();
};
