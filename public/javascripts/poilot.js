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
  okotowari: '　　　　　　ﾊ,,ﾊ\n　　　　　（ ﾟωﾟ )　　お断りします\n　　　　／　　 　＼\n　 ((⊂ 　） 　 ﾉ＼つ))\n　　　　　（＿⌒ヽ\n　　　　　　ヽ　ﾍ　}\n　ε≡Ξ　ﾉノ ｀J',
  koumei: '　　　　 　 　 　 r\'丁´￣￣￣￣｀7￢‐,-､ 　 　 　 　 　 ／\n　　　　　　　　r\'|　|　　　 　 　 　 |　 |/　 ＞、　　　　 /\n　　　　　　　　! |　|　　　 　 　 　 |　 |レ\'´／| 　 　 　 |　　 待 て\n　　　　　　　　| |　|　　 ／＼　　 |　 |l　 /⊂う　　　　|\n　　　　　　　　| |　|__∠∠ヽ_＼　|　 ﾘ　/　 j　　　　　ヽ 　 あ わ て る な\n　　　　　　　　|´￣　　　O　 ￣￣￣￣￣｀!　　　　　　〉\n　　　　　　　　l\'"´￣￣ヾ\'"´￣￣｀ヾ::幵ー{　　 　 　 /　　 こ れ は 孔 明 の 罠 だ\n　　　　　　　 ⊥,,,,,＿､　　　　＿__,,,,,ヾ| l::::::|　　　 　 |\n　　　　　　 　 lヾ´ ｆ｝｀7 　 ﾍ´ｆj￣ﾌ　 | l::i\'⌒ｉ　　　　|　　　 そ ん な 事 は 無 理 だ\n　　　　　　 　 l　,.ゝ‐ｲ　　　 `‐=ﾆ、ｉ　| l´ (　}　　　　ヽ\n　　　　　　 　 l 　 　 {　　　　　　 　 U | l　､_ﾉ　　　 ∠ヘ\n　　　　　　　　l　　　/￣　　\'\'ヽ、　　　| l　ヽ_　　　　　　　＼,＿＿＿＿＿＿＿＿＿\n　　 　 　 　 　 !　　ﾊ´￣￣￣｀ﾄ、　　|亅〃/＼\n　　　　　　　 ,人　ｆ　´￣￣￣｀`ヾ　 j ,!// {_っ ）､\n　　　　　　／/　｀ト､_＿iiiii＿_____,レ\'‐\'//　 _,／　/ｽｧ-､\n　　　　,.イl{ ｛ 々 !／´しllllﾄ､￣`ヽ、 // /´,.-、 /彑ゝ-{ｽｧ-､\n　　,.イ彑l l > ゞ く l　〃 l|ハ.lヽ、　ﾊVゝヽ二ノ/ゝ-{､彑ゝ-{､彑ｧ-､\n,.イ彑ゝ-\'l l　（ (,) レｼ′　　 !l　｀ｿｧ\'´　 　 _ノ7{､彑ゝ-{､彑ゝ-{､彑{\nュゝ-{､彑l l　 ` -イﾍ　 　 　 !ｌ　//　/⌒ヽヾ/_ゝ-{､彑ゝ-{､彑ゝ-{､\n　{､彑ゝ-\'l l f⌒Ｙﾊ　\',　　　　!l/ /　ヽ_う ﾉ /-{､彑ゝ-{､彑ゝ-{､彑ゝ\n彑ゝ-{､彑l l｛ に!小　ヽ　　 /!l /　　 ,／　/彑ゝ-{､彑ゝ-{､彑ゝ-{､',
  komakee: '　　　　　　　　　　　　 ／）\n　　　　　　　　　　　／／／）\n　　　　　　　　　 ／,.=ﾞ\'\'"／\n　　　／　　　　 i f　,.r=\'"-‐\'つ＿＿＿_　　　こまけぇこたぁいいんだよ！！\n　　/　　　　　 /　　　_,.-‐\'~／⌒　　⌒＼\n　　　　／　 　,i　　　,二ﾆ⊃（ ●）.　（●）＼\n　　　/　 　　ﾉ　　　 ilﾞフ::::::⌒（__人__）⌒::::: ＼\n　　　　　　,ｲ｢ﾄ､　　,!,!|　　　　　|r┬-|　　　　　|\n　　　　　/　iﾄヾヽ_/ｨ"＼ 　　 　 `ー\'´ 　 　 ／',
  kusakari: '　　　　_, ._ \n　　（　・ω・） \n　　○=｛=｝〇, \n　 　|:::::::::＼, \', ´ \n､､､､し ､､､((（.＠）ｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗ',
  nyaAA: '　　　　　　　　 ,-､　　　　　　　　　　　　,.-､ \n　　　　　　　 ./:::::＼　　　　　　　　　 ／::::::ヽ \n　　　　　　　/::::::::::::;ゝ--──-- ､._/::::::::::::::| \n　　　　　　 /,.-‐\'\'"´ 　　　　　　　　 ＼:::::::::::| \n　　　　　／　 　　　　　　　　　　　　　　ヽ､::::| \n　　　　/　　　　●　　　 　 　 　 　 　 　 　 ヽ| \n　　 　 l　　　, , ,　　 　 　 　 　 　 ●　　　 　 l \n　　　 .|　　　 　　　　(_人__丿　　　　　､､､　　|　　　　にゃーにゃーうっせんだよ死ねにゃあ \n　 　 　l　　　　　　　　　　　　　　　　　　　 　 l \n　　　　` ､　　　　　　　　 　 　 　 　 　 　 　 / \n　　　　　　`ｰ ､__　　　 　 　 　　　　　　　／ \n　　　　　　　　　/`\'\'\'ｰ‐‐──‐‐‐┬\'\'\'""´',
  gugureKasu: '　　 　   　, イ)ィ　-─ ──- ､ﾐヽ\n　　　 　 ノ ／,．-‐\'"´ ｀ヾj ii /　 Λ\n　　　 ,ｲ／／ ^ヽj(二ﾌ\'"´￣｀ヾ､ﾉｲ{\n　　 ノ/,／ミ三ﾆｦ´　　　　　　　 ﾞ､ﾉi!\n　　{V /ミ三二,ｲ　, 　／,　　 ,＼　 Yｿ\n　　ﾚ\'/三二彡ｲ　 .:ィこﾗ 　 ;:こﾗ 　j{\n　　V;;;::. ;ｦヾ!V　　　 ｰ \'′　i ｰ \'　ｿ\n　　 Vﾆﾐ( 入　､　　 　 　r　　j　　,′ 　\n　　　ヾﾐ､｀ゝ　　｀ ｰ--‐\'ゞﾆ<‐-イ\n　　　　　ヽ　ヽ　　　　 -\'\'ﾆﾆ‐　 /\n　 　 　 　 |　　｀､　　　　 ⌒　 ,/\n　　　 　 　|　　　 ＞┻━┻\'r‐\'´\n　　　　　　ヽ＿ 　 　 　 　 |\n　　　　　　　　　ヽ ＿ ＿ 」 　　　\n\n　　ググレカス [ Gugurecus ]\n　　（ 2006 ～ 没年不明 ）',
  postProcessors:[
    { 
      match: /にゃー$/m,
      run: function(poilot, options) {
        poilot.showMessage(poilotUtils.nyaAA, 10000);
      }
    },
    {
      match: /(.+)(って(何|なん|なに)だ?(\?|？))[wｗ]*$/m,
      run: function(poilot, options) {
        poilot.showMessage(poilotUtils.gugureKasu, 10000);
        poilot.showMessage('http://www.google.com/search?q=' + encodeURIComponent(options.matched[1]), 10000);
      }
    },
    {
      match: /([wｗ]{3,}|っ{2,}[wｗ]+)$/m,
      run: function(poilot, options) {
        poilot.showMessage(poilotUtils.kusakari, 10000);
      }
    },
    {
      match: function(data) { 
        return data.length > 30 && !data.match(/　/m) && !data.match(/https?:\/\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/m);
      },
      run: function(poilot, options) {
        poilot.showMessage(poilotUtils.komakee, 10000);
      }
    },
    {
      match: /しようと思う/m,
      run: function(poilot, options) {
        poilot.showMessage(poilotUtils.koumei, 10000);
      }
    },
    {
      match: /(お願い|頼む|よろしく|してよ?)。?[wｗ]*$/m,
      run: function(poilot, options) {
        poilot.showMessage(poilotUtils.okotowari, 10000);
      }
    },
    null
  ],
  dummy: null
};

var Poilot = function() {
  this.socket = new io.Socket( location.hostname, { port:location.port} );
};
Poilot.prototype = {
  title        : 'Poilot',
  blur         : false,
  unReadCount  : 0,
  maxDepth     : 5,
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
  showMessage: function(string, depth) {
    if (!depth) { depth = 0; };
    depth++;
    var div = null;
    var data = string;
    var rawData = data;
    if (data.match(/^https?(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)(\.png|\.gif|\.jpg|\.jpeg)$/m)) {
      div = $('<div/>');
      div.html('<img src="' + poilotUtils.escape(data) + '" alt="" />');
    } else if (data.match(/　/m)) {
      div = $('<pre class="chatlog aa"></pre>');
      div.text(data);
    } else {
      div = $('<p class="chatlog"></p>');
      div.text(data);
      data = div.html()
        .replace(/\n/mg, '<br/>')
        .replace(/\s/mg, '&nbsp;')
        .replace(/https?:\/\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/mg, function(url, shortUrl) {
          if (shortUrl.length > 30) {
            shortUrl = shortUrl.substring(0, 30) + '...';
          }
          return '<a href="' + url + '">' + shortUrl + '</a>';
        });
      div.html(data);
    }
    $('#chat').prepend(div);
    
    if (depth > this.maxDepth) { return; };
    var p = null;
    var matched = null;
    for (var i=0; i<poilotUtils.postProcessors.length; i++) {
      p = poilotUtils.postProcessors[i];
      if (!p) {continue;};
      if (p.match) {
        if (matched = p.match instanceof RegExp ? rawData.match(p.match) : p.match(rawData)) {
          p.run(this, {
            data: rawData,
            matched: matched,
            depth: depth
          });
        } 
      }
    }
  },
  showImage: function(url) {
    var div = $('<div/>');
    div.html('<img src="' + poilotUtils.escape(url) + '" alt="" />');
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
  },
  currentHistory: {
    text: -1,
    exec: -1
  },
  histories: {
    text: [],
    exec: []
  }
};
Poilot.prototype.evalString.toLocaleString = poilotUtils.createLocaleString('Evaluate argument string.');
Poilot.prototype.showMessage.toLocaleString = poilotUtils.createLocaleString('Show message from string.');
Poilot.prototype.showImage.toLocaleString = poilotUtils.createLocaleString('Show image from url.');
Poilot.prototype.toLocaleString.toLocaleString = poilotUtils.createLocaleString('Return locale string.');
Poilot.prototype.write.toLocaleString = poilotUtils.createLocaleString('Write string to chat log.');
Poilot.prototype.alert.toLocaleString = poilotUtils.createLocaleString('Alert string to chat log.');
Poilot.prototype.reload.toLocaleString = poilotUtils.createLocaleString('Reload all users page.');
Poilot.prototype.help.toLocaleString = function() {
  return Poilot.prototype.help();
};
