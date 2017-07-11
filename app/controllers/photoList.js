var args = $.args;
var currentKeyboardOwner = undefined;

Alloy.Globals.photoListNavigationWindow = $.photoListNav;
var cropPickerValue = $.cropField.getValue(); // crop Picker で取得した文字
var workPickerValue = $.workField.getValue(); // work Picker で取得した文字

function cleanup() {
  $.destroy();
};

function showPhotoDetail(e) {
  Alloy.Globals.tabGroup.animate({bottom: -50, duration: 0});
  Alloy.Globals.tabGroup.remove(Alloy.Globals.customCameraContainer);
  $.photoDetailScrollableView.setCurrentPage(e.itemIndex);


  $.photoDetailContainer.setVisible(true);

  var openAnimation = Ti.UI.createAnimation({
    bottom: 0,
    duration: 250
  });
  $.photoDetailContainer.animate(openAnimation);
};

function addPhoto() {
  Ti.Media.openPhotoGallery({
    success: function(e) {
      var photo = Ti.UI.createImageView({
        image: e.media,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL
      }).toImage(null, true);

      var date = Alloy.Globals.moment().format('YYYY-MM-DD HH:mm:ss');
      Alloy.createModel('photoRecord', {
        name: Ti.App.Properties.getObject('recordProperties').name,
        photo: photo,
        date: date,
        work: Ti.App.Properties.getObject('recordProperties').work,
        note: null
      }).save();

      Alloy.Globals.photoUpdate = true;
      Alloy.Globals.updateUI();
    },
    error: function(e) {},
    mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO,
    autoHide: true,
    animated: true,
    allowEditing: false
  });
};

function hidePhotoDetailView() {
  Alloy.Globals.tabGroup.add(Alloy.Globals.customCameraContainer);
  Alloy.Globals.tabGroup.animate({bottom: 0, duration: 0});
  var closeAnimation = Ti.UI.createAnimation({
    bottom: '-100%',
    duration: 250
  });
  $.photoDetailContainer.animate(closeAnimation, function() {
    $.photoDetailContainer.setVisible(false);
  });
};

function deleteCrop() {
  $.confirmDialog.show();
};

function confirmPhotoAction(e) {
  switch (e.index) {
    case 0:
      var item = $.photoListSection.getItemAt($.photoDetailScrollableView.getCurrentPage());
      var name = item.name.text;
      var work = item.properties.workValue;
      var date = item.properties.dateValue;
      var note= item.note.text;

      $.cropField.setValue(name);
      $.workField.setValue(work);
      $.noteArea.setValue(note);

      $.editPhotoContainer.setVisible(true);
      var animate = Ti.UI.createAnimation({
        right: 0,
        duration: 250
      });
      $.editPhotoContainer.animate(animate);
      break;
    case 1:
      var photoId = $.photoDetailScrollableView.getViews()[$.photoDetailScrollableView.getCurrentPage()].photoId;
      Alloy.Collections.photoRecord.fetch({
        query: {
          statement: 'SELECT * FROM photoRecord WHERE id = ?',
          params: [photoId]
        },
        success: function() {
          var photoRecordModel = Alloy.Collections.photoRecord.first();
          photoRecordModel.destroy();
          $.photoListWin.setFullscreen(false);
          Alloy.Globals.tabGroup.add(Alloy.Globals.customCameraContainer);
          Alloy.Globals.tabGroup.animate({bottom: 0, duration: 0});
          var closeAnimation = Ti.UI.createAnimation({
            bottom: '-100%',
            duration: 250
          });
          $.photoDetailContainer.animate(closeAnimation, function() {
            $.photoDetailContainer.setVisible(false);
          });

          Alloy.Globals.photoUpdate = true;
          Alloy.Globals.updateUI();
        }
      });
      break;
    default:
      break;
  }
  this.setTintColor('#009900');
};

function hideEditPhotoView() {
  var animate = Ti.UI.createAnimation({
    right: '-100%',
    duration: 250
  });
  $.editPhotoContainer.animate(animate, function() {
    $.editPhotoContainer.setVisible(false);
  });
};

function updatePhotoData() {
  var photoId = $.photoDetailScrollableView.getViews()[$.photoDetailScrollableView.getCurrentPage()].photoId;
  var currentPage = $.photoDetailScrollableView.getCurrentPage();
  Alloy.Collections.photoRecord.fetch({
    query: {
      statement: 'SELECT * FROM photoRecord WHERE id = ?',
      params: [photoId]
    },
    success: function() {
      var photoRecordModel = Alloy.Collections.photoRecord.first();
      photoRecordModel.set({
        name: $.cropField.value,
        work: $.workField.value,
        note: $.noteArea.value
      });
      photoRecordModel.save(null, {
        success: function() {
          Alloy.Globals.photoUpdate = true;
          Alloy.Globals.updateUI();
          $.photoDetailScrollableView.setCurrentPage(currentPage);
          hideEditPhotoView();
        }
      });
    }
  });
};

function openPicker() {
  var pickerView;
  if (this.name === 'crop') {
    pickerView = $.cropPickerView;
  } else {
    pickerView = $.workPickerView;
  }

  pickerView.setVisible(true);

  var animate = Ti.UI.createAnimation({
    bottom: 0,
    duration: 300
  });

  pickerView.animate(animate);
};

function resetValue() {
  Ti.API.debug(this.name);
};

function hidePicker() {
  var pickerView;
  if (this.name === 'crop') {
    pickerView = $.cropPickerView;
  } else {
    pickerView = $.workPickerView;
  }
  var animate = Ti.UI.createAnimation({
    bottom: '-100%',
    duration: 300
  });

  pickerView.animate(animate, function() {
    pickerView.setVisible(false);
  });
};

function getCropPickerValue(e) {
  cropPickerValue = $.cropPickerColumn.rows[e.rowIndex].title;
};

function getWorkPickerValue(e) {
  workPickerValue = $.workPickerColumn.rows[e.rowIndex].title;
};

function doneClick() {
  var pickerView;
  if (this.name === 'crop') {
    $.cropField.setValue(cropPickerValue);
    pickerView = $.cropPickerView;
  } else {
    $.workField.setValue(workPickerValue);
    pickerView = $.workPickerView;
  }

  var animate = Ti.UI.createAnimation({
    bottom: '-100%',
    duration: 300
  });

  pickerView.animate(animate, function() {
    pickerView.setVisible(false);
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

function getZoomScale(photo) {
  var zoomScale;
  if (photo.width != null) {
    var widthScale = 1 / Math.ceil(photo.width / Ti.Platform.displayCaps.platformWidth);
    var heightScale = 1 / Math.ceil(photo.height / Ti.Platform.displayCaps.platformHeight);
    zoomScale = widthScale >= heightScale ? heightScale : widthScale;
    if (zoomScale < 0.5) {
      widthScale = 1 / (photo.width / Ti.Platform.displayCaps.platformWidth);
      heightScale = 1 / (photo.height / Ti.Platform.displayCaps.platformHeight);
      zoomScale = widthScale >= heightScale ? heightScale : widthScale;
    }
  } else {
    zoomScale = 0.5;
  }
  return zoomScale;
};

function transformPhotoList(model) {
  var transform = model.toJSON();
  transform.name = transform.name == null ? '無名の作物' : transform.name;
  var workValue = transform.work;
  transform.work = workValue == null ? '農作業：未入力' : '農作業: ' + workValue;
  var dateValue = transform.date;
  transform.date = '記録日: ' + Alloy.Globals.moment(dateValue, 'YYYY-MM-DD HH:mm:ss').format('YYYY年M月D日');
  transform.note = transform.note == null ? 'メモがありません' : transform.note;
  transform.workValue = workValue;
  transform.dateValue = dateValue;

  return transform;
};

function filterPhotoList(collection) {
  return collection.models;
};

function transformPhotoDetail(model) {
  var transform = model.toJSON();
  transform.name = transform.name == null ? '無名の作物' : transform.name;
  transform.work = transform.work == null ? '農作業：未入力' : '農作業: ' + transform.work;
  transform.date = '記録日: ' + Alloy.Globals.moment(transform.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY年M月D日');
  transform.photoId = transform.id;
  transform.zoomScale = getZoomScale(transform.photo);

  return transform;
};

function filterPhotoDetail(collection) {
  return collection.models;
};

Alloy.Globals.updateUI = function () {
  if (Alloy.Globals.photoUpdate) {
    Alloy.Collections.photoRecord.fetch({
      success: function() {
        updatePhotoList();
        updatePhotoDetail();
        Alloy.Globals.photoUpdate = false;
      }
    });
  }

  if (Alloy.Globals.cropUpdate) {
    Alloy.Collections.crop.fetch({
      query: {
        statement: 'SELECT DISTINCT name FROM crop',
        params: []
      },
      success: function() {
        updateCropValue();
        Alloy.Globals.cropUpdate = false;
      }
    });
  }

  if (Alloy.Globals.workUpdate) {
    Alloy.Collections.work.fetch({
      query: {
        statement: 'SELECT DISTINCT name FROM work',
        params: []
      },
      success: function() {
        updateWorkValue();
        Alloy.Globals.workUpdate = false;
      }
    });
  }
};

function transformCropValue(model) {
  var transform = model.toJSON();
  return transform;
};

function filterCropValue(collection) {
  return collection.models;
};

function transformWorkValue(model) {
  var transform = model.toJSON();
  return transform;
};

function filterWorkValue(collection) {
  return collection.models;
};

Alloy.Collections.photoRecord.fetch();
Alloy.Collections.crop.fetch({
  query: {
    statement: 'SELECT DISTINCT name FROM crop',
    params: []
  }
});
Alloy.Collections.work.fetch({
  query: {
    statement: 'SELECT DISTINCT name FROM work',
    params: []
  }
});
