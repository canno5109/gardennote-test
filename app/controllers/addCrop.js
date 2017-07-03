var args = $.args;
var currentKeyboardOwner = undefined;

function closeWin() {
  $.addCrop.close();
};

function reset() {
  $.destroy();
};

function save() {
  var name = $.nameField.value;
  if (name.length !== 0) {
    Alloy.createModel('crop', {
      name: name
    }).save(null, {
      success: function() {
        Alloy.Globals.cropUpdate = true;
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
