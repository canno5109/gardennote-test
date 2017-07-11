var args = $.args;
var currentKeyboardOwner = undefined;
var cropId = args.cropId;
$.nameField.setValue(args.name);

if (Ti.App.Properties.getObject('recordProperties').cropId == cropId) {
  $.selectCropBtn.setTouchEnabled(false);
  $.selectCropBtn.setTitle('選択済み');
  $.selectCropBtn.setOpacity(0.3);
}

function closeWin() {
  $.editCrop.close();
};

function cleanup() {
  $.destroy();
};

function update() {
  var name = $.nameField.value;
  if (name.length > 0) {
    Alloy.Collections.crop.fetch({
      query: {
        statement: 'SELECT * FROM crop WHERE id = ?',
        params: [cropId]
      },
      success: function() {
        var crop = Alloy.Collections.crop.first();
        crop.set({name: name});
        crop.save();
        closeWin();
        Alloy.Globals.cropUpdate = true;
      }
    });
  } else {
    $.errorDialog.show();
  }
};

function deleteCrop() {
  $.confirmDialog.setTintColor('#009900');
  $.confirmDialog.show();
};

function confirmDeleteCrop(e) {
  if (e.index == 0) {
    Alloy.Collections.crop.fetch({
      query: {
        statement: 'SELECT * FROM crop WHERE id = ?',
        params: [cropId]
      },
      success: function () {
        var cropModel = Alloy.Collections.crop.first();
        if (cropId == Ti.App.Properties.getObject('recordProperties').cropId) {
          Ti.App.Properties.setObject('recordProperties', {
            name: null,
            work: null,
            cropId: null,
            workId: null
          });
        }
        cropModel.destroy();
        Alloy.Globals.cropUpdate = true;
        closeWin();
      }
    });
  }
};

function selectCrop() {
  Alloy.Collections.crop.fetch({
    query: {
      statement: 'SELECT * FROM crop WHERE id = ?',
      params: [cropId]
    },
    success: function () {
      var cropModel = Alloy.Collections.crop.first();
      Ti.App.Properties.setObject('recordProperties', {
        name: cropModel.get('name'),
        work: null,
        cropId: cropModel.get('id'),
        workId: Ti.App.Properties.getObject('recordProperties').workId,
        theme: Ti.App.Properties.getObject('recordProperties').theme
      });
      $.selectCropBtn.setTouchEnabled(false);
      $.selectCropBtn.setTitle('選択済み');
      $.selectCropBtn.setOpacity(0.3);
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
