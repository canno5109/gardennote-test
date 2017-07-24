var args = $.args;
var currentKeyboardOwner = undefined;


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

function saveInitialSetting() {
  if ($.user_name.value === '') {
    Ti.UI.createAlertDialog({title: 'お知らせ', message: 'ユーザ名を入力してください'}).show();
    return;
  }

  Ti.App.Properties.setString('user_name', $.user_name.value);
  Ti.App.Properties.setString('theme', $.theme.value);
  Ti.App.Properties.setBool('initialActivation', true);

  $.initialSettingWin.close();
  Alloy.createController('tab').getView().open({
    modalTransitionStyle: Ti.UI.iOS.MODAL_TRANSITION_STYLE_CROSS_DISSOLVE
  });
};
