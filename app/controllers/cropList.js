var args = $.args;

function closeWin() {
  $.cropList.close();
};

function cleanup() {
  $.destroy();
};

function addCrop() {
  var addCropWin = Alloy.createController('addCrop').getView();
  Alloy.Globals.recordPropertiesNavigationWindow.openWindow(addCropWin);
};

function openEditCrop(e) {
  var item = $.cropListSection.getItemAt(e.itemIndex);
  var name = item.name.text;
  var cropId = item.properties.cropId;
  var editCropWin = Alloy.createController('editCrop', {name: name, cropId: cropId}).getView();
  Alloy.Globals.recordPropertiesNavigationWindow.openWindow(editCropWin);
};

function transformCrop(model) {
  var transform = model.toJSON();
  transform.cropId = transform.id;
  transform.check = transform.cropId == Ti.App.properties.getObject('recordProperties').cropId ? '\uf00c' : '';
  return transform;
};

function filterCrop(collection) {
  return collection.models;
};

function refreshCrop() {
  Alloy.Collections.crop.fetch({
    success: function() {
      updateCrop();
    }
  });
};

Alloy.Collections.crop.fetch();
