var data = require("sdk/self").data;
var { Hotkey } = require("sdk/hotkeys");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");

var text_entry = require("sdk/panel").Panel({
  width: 147,
  height: 40,
  position: {
    top: 0,
    right: 0
  },
  contentURL: data.url("text-entry.html"),
  contentScriptFile: data.url("get-text.js")
});

var showPanel = Hotkey({
  combo: "accel-shift-o",
  onPress: function() {
    showTextPanel();
  }
});

var hidePanel = Hotkey({
  combo: "accel-alt-shift-o",
  onPress: function() {
    hideTextPanel();
  }
});

function showTextPanel(state) { text_entry.show(); }
function hideTextPanel(state) { text_entry.hide(); }

text_entry.on("show", function() {
  text_entry.port.emit("show");
});

text_entry.port.on("text-entered", function (text) {
  var pm = pageMod.PageMod({
    include: tabs.activeTab.url,
    attachTo: ['existing', 'top'],
    contentScriptFile: [data.url('vendors/jquery-2.2.3.min.js'),
                        data.url('vendors/withinviewport.js'),
                        data.url('vendors/jquery.withinviewport.js'),
                        data.url('highlighter.js')],
    contentStyleFile: data.url('highlighter.css'),
    onAttach: function(worker){
      worker.port.emit('highlight-text', text);
    }
  });
});
