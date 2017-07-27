var args = $.args;
var currentKeyboardOwner = undefined;

$.userNameForm.setValue(Ti.App.Properties.getString('user_name'));

function closeWin() {
  $.user_name.close();
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

function updateUserName() {
  if ($.userNameForm.getValue() === '') {
    Ti.UI.createAlertDialog({title: 'お知らせ', message: 'ユーザ名を入力してください'}).show();
    return;
  }

  Ti.App.Properties.setString('user_name', $.userNameForm.getValue());
  closeWin();
};

