var args = $.args;
Alloy.Globals.recordPropertiesNavigationWindow = $.recordPropertiesNav;

Alloy.Globals.updateRecordProperties = function() {
  var cropItem = $.recordPropertiesListView.getSections()[0].getItemAt(0);
  var workItem = $.recordPropertiesListView.getSections()[0].getItemAt(1);
  cropItem.name.text =  Ti.App.Properties.getObject('recordProperties').name == null ? '作物が選択されていません' : Ti.App.Properties.getObject('recordProperties').name;
  cropItem.name.color = Ti.App.Properties.getObject('recordProperties').name == null ? '#808080' : '#464646';
  workItem.name.text =  Ti.App.Properties.getObject('recordProperties').work == null ? '農作業が選択されていません' : Ti.App.Properties.getObject('recordProperties').work;
  workItem.name.color =  Ti.App.Properties.getObject('recordProperties').work == null ? '#808080' : '#464646';
  $.recordPropertiesListView.getSections()[0].updateItemAt(0, cropItem, {animated: false});
  $.recordPropertiesListView.getSections()[0].updateItemAt(1, workItem, {animated: false});
};

function onItemClick(e) {
  if (e.sectionIndex === 0) {
    switch (e.itemIndex) {
      case 0:
        var cropListWin = Alloy.createController('cropList').getView();
        Alloy.Globals.recordPropertiesNavigationWindow.openWindow(cropListWin);
        break;
      case 1:
        return;
        var workListWin = Alloy.createController('workList').getView();
        Alloy.Globals.recordPropertiesNavigationWindow.openWindow(workListWin);
        break;
      default:
        break;
    }
  }
};
