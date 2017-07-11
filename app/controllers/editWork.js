var args = $.args;
var currentKeyboardOwner = undefined;
var workId = args.workId;
$.nameField.setValue(args.name);

if (Ti.App.Properties.getObject('recordProperties').workId == workId) {
  $.selectWorkBtn.setTouchEnabled(false);
  $.selectWorkBtn.setTitle('選択済み');
  $.selectWorkBtn.setOpacity(0.3);
}

function closeWin() {
  $.editWork.close();
};

function cleanup() {
  $.destroy();
};

function update() {
  var name = $.nameField.value;
  if (name.length > 0) {
    Alloy.Collections.work.fetch({
      query: {
        statement: 'SELECT * FROM work WHERE id = ?',
        params: [workId]
      },
      success: function() {
        var work = Alloy.Collections.work.first();
        work.set({name: name});
        work.save();
        Alloy.Globals.workUpdate = true;
        closeWin();
      }
    });
  } else {
    $.errorDialog.show();
  }
};

function deleteWork() {
  $.confirmDialog.setTintColor('#009900');
  $.confirmDialog.show();
};

function confirmDeleteWork(e) {
  if (e.index == 0) {
    Alloy.Collections.work.fetch({
      query: {
        statement: 'SELECT * FROM work WHERE id = ?',
        params: [workId]
      },
      success: function () {
        var workModel = Alloy.Collections.work.first();
        if (workId == Ti.App.Properties.getObject('recordProperties').workId);
        Ti.App.Properties.setObject('recordProperties', {
          name: workModel.get('name'),
          work: null,
          cropId: this.cropId,
          workId: null
        });
        workModel.destroy();
        Alloy.Globals.workUpdate = true;
        closeWin();
      }
    });
  }
};

function selectWork() {
  Alloy.Collections.work.fetch({
    query: {
      statement: 'SELECT * FROM work WHERE id = ?',
      params: [workId]
    },
    success: function () {
      var workModel = Alloy.Collections.work.first();
      Ti.App.Properties.setObject('recordProperties', {
        name: Ti.App.Properties.getObject('recordProperties').name,
        work: workModel.get('name'),
        cropId: Ti.App.Properties.getObject('recordProperties').cropId,
        workId: workModel.get('id'),
        theme: Ti.App.Properties.getObject('recordProperties').theme
      });
      Ti.API.debug(JSON.stringify(Ti.App.Properties.getObject('recordProperties')));
      $.selectWorkBtn.setTouchEnabled(false);
      $.selectWorkBtn.setTitle('選択済み');
      $.selectWorkBtn.setOpacity(0.3);
    }
  });
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
