var args = $.args;
var currentKeyboardOwner = undefined;

$.themeArea.setValue(Ti.App.Properties.getObject('user').theme);

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
  let value = $.themeArea.getValue();
  if (value == '') {
    let user = Ti.App.Properties.getObject('user');
    user.theme = null;
    Ti.App.Properties.setObject('user', user);
  } else {
    let user = Ti.App.Properties.getObject('user');
    user.theme = value;
    Ti.App.Properties.setObject('user', user);
  }
  closeWin();
};

