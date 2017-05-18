var args = $.args;
var currentKeyboardOwner = undefined;
var cropId = args.cropId;
$.nameField.setValue(args.name);

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
  $.confirmDialog.show();
};

function confirmDeleteCrop(e) {
  if (e.index == 0) {
    alert('削除');
  } else {
    alert('キャンセル');
  }
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
