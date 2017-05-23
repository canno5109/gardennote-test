var args = $.args;
var currentKeyboardOwner = undefined;

function closeWin() {
  Alloy.Globals.updateRecordProperties();
  Alloy.Globals.refreshWork();
  $.addWork.close();
};

function reset() {
  $.destroy();
};

function save() {
  var name = $.nameField.value;
  if (name.length !== 0) {
    Alloy.createModel('work', {
      name: name,
      cropId: Ti.App.Properties.getObject('recordProperties').cropId
    }).save(null, {
      success: function() {
        closeWin();
      }
    });
  }
};

// 表示されたキーボードのオーナーを格納
function setKeyboardOwner(e) {
  currentKeyboardOwner = e.source;
  e.cancelBubble = true;
};

// キーボードを閉じる
function hideKeyboard() {
  if (typeof(currentKeyboardOwner) !== 'undefined') {
    currentKeyboardOwner.blur();
  }
};
