var args = $.args;

function closeWin() {
  $.workList.close();
};

function cleanup() {
  $.destroy();
};

function addWork() {
  var addWorkWin = Alloy.createController('addWork').getView();
  Alloy.Globals.recordPropertiesNavigationWindow.openWindow(addWorkWin);
};

function openEditWork(e) {
  var item = $.workListSection.getItemAt(e.itemIndex);
  var name = item.name.text;
  var workId = item.properties.workId;
  var editWorkWin = Alloy.createController('editWork', {name: name, workId: workId}).getView();
  Alloy.Globals.recordPropertiesNavigationWindow.openWindow(editWorkWin);
};

function transformWork(model) {
  var transform = model.toJSON();
  transform.workId = transform.id;
  transform.check = transform.workId == Ti.App.properties.getObject('recordProperties').workId ? '\uf00c' : '';
  return transform;
};

function filterWork(collection) {
  return collection.models;
};

function refreshWork() {
  Alloy.Collections.work.fetch({
    query: {
      statement: 'SELECT * FROM work WHERE cropId = ?',
      params: [Ti.App.Properties.getObject('recordProperties').cropId]
    },
    success: function () {
      updateWork();
    }
  });
};

Alloy.Collections.work.fetch({ query: { statement: 'SELECT * FROM work WHERE cropId = ?', params: [Ti.App.Properties.getObject('recordProperties').cropId] } });
