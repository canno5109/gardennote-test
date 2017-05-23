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

function reset() {
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
        if (cropModel.get('id') == Ti.App.Properties.getObject('recordProperties').cropId) {
          Ti.App.Properties.setObject('recordProperties', {
            name: null,
            work: null,
            cropId: null
          });
        }
        cropModel.destroy();
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
          cropId: cropModel.get('id')
        });
        $.selectCropBtn.setTouchEnabled(false);
        $.selectCropBtn.setTitle('選択済み');
        $.selectCropBtn.setOpacity(0.3);
        Alloy.Globals.updateRecordProperties();
        Alloy.Globals.refreshCrop();
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
