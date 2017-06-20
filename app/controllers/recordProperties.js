var args = $.args;
Alloy.Globals.recordPropertiesNavigationWindow = $.recordPropertiesNav;

function updateRecordProperties() {
  var cropItem = $.photoListSection.getItemAt(0);
  var workItem = $.photoListSection.getItemAt(1);
  cropItem.name.text =  Ti.App.Properties.getObject('recordProperties').name == null ? '作物が選択されていません' : Ti.App.Properties.getObject('recordProperties').name;
  cropItem.name.color = Ti.App.Properties.getObject('recordProperties').name == null ? '#808080' : '#464646';
  workItem.name.text =  Ti.App.Properties.getObject('recordProperties').work == null ? '農作業が選択されていません' : Ti.App.Properties.getObject('recordProperties').work;
  workItem.name.color =  Ti.App.Properties.getObject('recordProperties').work == null ? '#808080' : '#464646';
  $.photoListSection.updateItemAt(0, cropItem, {animated: false});
  $.photoListSection.updateItemAt(1, workItem, {animated: false});
  Ti.API.debug(cropItem);
};
Alloy.Globals.updateRecordProperties = updateRecordProperties;

function onItemClick(e) {
  if (e.sectionIndex === 0) {
    switch (e.itemIndex) {
      case 0:
        var cropListWin = Alloy.createController('cropList').getView();
        Alloy.Globals.recordPropertiesNavigationWindow.openWindow(cropListWin);
        break;
      case 1:
        if (Ti.App.Properties.getObject('recordProperties').name == null) {
          return;
        }
        var workListWin = Alloy.createController('workList').getView();
        Alloy.Globals.recordPropertiesNavigationWindow.openWindow(workListWin);
        break;
      default:
        break;
    }
  }
};
