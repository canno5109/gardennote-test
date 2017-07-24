var args = $.args;
var currentKeyboardOwner = undefined;

$.themeArea.setValue(Ti.App.Properties.getString('theme'));

function closeWin() {
  $.theme.close();
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

function updateTheme() {
  var value = $.themeArea.getValue();
  if (value == '') {
    Ti.App.Properties.setString('theme', '');
  } else {
    Ti.App.Properties.setString('theme', value);
  }
  closeWin();
};

