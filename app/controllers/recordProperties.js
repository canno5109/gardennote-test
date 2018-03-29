var args = $.args;
Alloy.Globals.recordPropertiesNavigationWindow = $.recordPropertiesNav;

function updateRecordProperties() {
  var themeItem = $.photoListSection.getItemAt(1);
  themeItem.name.text = Ti.App.Properties.getObject('user').theme == null ? '未入力' : Ti.App.Properties.getObject('user').theme;
  themeItem.name.color = Ti.App.Properties.getObject('user').theme == null ? '#808080' : '#464646';
  $.photoListSection.updateItemAt(1, themeItem, {animated: false});

  var user_nameItem = $.photoListSection.getItemAt(3);
  user_nameItem.name.text = Ti.App.Properties.getObject('user').first_name_kanji + ' ' + Ti.App.Properties.getObject('user').last_name_kanji;
  $.photoListSection.updateItemAt(3, user_nameItem, {animated: false});
};

function onItemClick(e) {
  switch (e.itemId) {
    case 'theme':
      var themeWin = Alloy.createController('theme').getView();
     Alloy.Globals.recordPropertiesNavigationWindow.openWindow(themeWin);
     break;

    case 'upload':
     var uploadWin = Alloy.createController('upload').getView();
     Alloy.Globals.recordPropertiesNavigationWindow.openWindow(uploadWin);
     break;

    case 'midori':
      var midoriBoxWin = Alloy.createController('midoriBox').getView();
     Alloy.Globals.recordPropertiesNavigationWindow.openWindow(midoriBoxWin);
     break;

    case 'mail':
      openEmailDialog();
     break;

    default:
      break;
  }
};

function openEmailDialog() {
  var emailDialog = Ti.UI.createEmailDialog({
    subject: '【作物観察記録】報告',
    messageBody: '（ここにご意見・ご要望を記入してください）',
    toRecipients: ['g031m059@s.iwate-pu.ac.jp']
  });

  emailDialog.addEventListener('complete', function(e) {
    if (!e.success) {
      var errorDialog = Ti.UI.createAlertDialog({
        title: 'お知らせ',
        message: 'このiPhoneはメール設定がされていません。\nメール設定のうえ、g031m059@s.iwate-pu.ac.jpまでご連絡ください。'
      });
      errorDialog.show();
    }
  });

  emailDialog.open();
};
