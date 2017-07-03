var args = $.args;
Alloy.Globals.recordPropertiesNavigationWindow = $.recordPropertiesNav;

function updateRecordProperties() {
  var themeItem = $.photoListSection.getItemAt(1);
  var cropItem = $.photoListSection.getItemAt(3);
  var workItem = $.photoListSection.getItemAt(5);
  themeItem.name.text =  Ti.App.Properties.getObject('recordProperties').theme == '' ? '未入力' : Ti.App.Properties.getObject('recordProperties').theme;
  themeItem.name.color = Ti.App.Properties.getObject('recordProperties').theme == null ? '#808080' : '#464646';
  cropItem.name.text =  Ti.App.Properties.getObject('recordProperties').name == null ? '未選択' : Ti.App.Properties.getObject('recordProperties').name;
  cropItem.name.color = Ti.App.Properties.getObject('recordProperties').name == null ? '#808080' : '#464646';
  workItem.name.text =  Ti.App.Properties.getObject('recordProperties').work == null ? '未選択' : Ti.App.Properties.getObject('recordProperties').work;
  workItem.name.color =  Ti.App.Properties.getObject('recordProperties').work == null ? '#808080' : '#464646';
  $.photoListSection.updateItemAt(1, themeItem, {animated: false});
  $.photoListSection.updateItemAt(3, cropItem, {animated: false});
  $.photoListSection.updateItemAt(5, workItem, {animated: false});

  Alloy.Globals.updateUI();
};

function onItemClick(e) {
  switch (e.itemId) {
    case 'theme':
      var themeWin = Alloy.createController('theme').getView();
    Alloy.Globals.recordPropertiesNavigationWindow.openWindow(themeWin);
    break;

    case 'crop':
      var cropListWin = Alloy.createController('cropList').getView();
    Alloy.Globals.recordPropertiesNavigationWindow.openWindow(cropListWin);
    break;

    case 'work':
      if (Ti.App.Properties.getObject('recordProperties').name == null) {
      return;
    }
    var workListWin = Alloy.createController('workList').getView();
    Alloy.Globals.recordPropertiesNavigationWindow.openWindow(workListWin);
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
