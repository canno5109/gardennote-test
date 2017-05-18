var args = $.args;
Alloy.Globals.recordPropertiesNavigationWindow = $.recordProperties;

function updateItem() {
  var cropItem = $.recordPropertiesListView.getSections()[0].getItemAt(0);
  var workItem = $.recordPropertiesListView.getSections()[0].getItemAt(1);
  cropItem.name.text =  Ti.App.Properties.getObject('recordProperties').name;
  workItem.name.text =  Ti.App.Properties.getObject('recordProperties').work;
  $.recordPropertiesListView.getSections()[0].updateItemAt(0, cropItem, {animated: false});
  $.recordPropertiesListView.getSections()[0].updateItemAt(1, workItem, {animated: false});
};

function onItemClick(e) {
  // $.recordPropertiesListView.getSections()[e.sectionIndex].getItemAt(e.itemIndex);
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

updateItem();
