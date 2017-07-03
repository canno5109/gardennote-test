var args = $.args;
var currentKeyboardOwner = undefined;
var themeAdvice = '作物観察記録を利用する目的やテーマを入力してください';

function cleanup() {
  $.destroy();
};

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
  if (value == '' || value == themeAdvice) {
    Ti.App.Properties.setObject('recordProperties', {
      name: Ti.App.Properties.getObject('recordProperties').name,
      work: Ti.App.Properties.getObject('recordProperties').work,
      cropId: Ti.App.Properties.getObject('recordProperties').cropId,
      workId: Ti.App.Properties.getObject('recordProperties').workId,
      theme: ''
    });
  } else {
    Ti.App.Properties.setObject('recordProperties', {
      name: Ti.App.Properties.getObject('recordProperties').name,
      work: Ti.App.Properties.getObject('recordProperties').work,
      cropId: Ti.App.Properties.getObject('recordProperties').cropId,
      workId: Ti.App.Properties.getObject('recordProperties').workId,
      theme: value
    });
  }

  closeWin();
};

function setAreaValue() {
  if (Ti.App.Properties.getObject('recordProperties').theme != '') {
    $.themeArea.setValue(Ti.App.Properties.getObject('recordProperties').theme);
  } else {
    $.themeArea.setValue(themeAdvice);
  }
};
