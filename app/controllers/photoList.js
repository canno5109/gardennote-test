var args = $.args;
var currentKeyboardOwner = undefined;
Alloy.Globals.photoListNavigationWindow = $.photoListNav;

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

      updateUI();
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

  updateUI();
};

function deleteCrop() {
  $.confirmDialog.show();
};

function confirmDeleteCrop(e) {
  switch (e.index) {
    case 0:
      var item = $.photoListSection.getItemAt($.photoDetailScrollableView.getCurrentPage());
      var name = item.name.text;
      var work = item.workValue;
      var date = item.dateValue;
      var note= item.note.text;

      $.nameField.setValue(name);
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
      $.photoRecord.fetch({
        query: {
          statement: 'SELECT * FROM photoRecord WHERE id = ?',
          params: [photoId]
        },
        success: function() {
          var photoRecordModel = $.photoRecord.first();
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

          updateUI();
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
  $.photoRecord.fetch({
    query: {
      statement: 'SELECT * FROM photoRecord WHERE id = ?',
      params: [photoId]
    },
    success: function() {
      var photoRecordModel = $.photoRecord.first();
      photoRecordModel.set({
        name: $.nameField.value,
        work: $.workField.value,
        note: $.noteArea.value
      });
      photoRecordModel.save(null, {
        success: function() {
          updateUI();
          $.photoDetailScrollableView.setCurrentPage(currentPage);
          hideEditPhotoView();
        }
      });
    }
  });
};

function openPicker() {
  $.picker.columns = [];
  var column = Ti.UI.createPickerColumn();
  if (this.name === 'crop') {
    $.cropCollection.fetch({
      success: function() {
        $.cropCollection.each(function(crop) {
          Ti.API.debug(crop.get('name'));

          var row = Ti.UI.createPickerRow();
          var label = Ti.UI.createLabel({
            color: '#464646',
            font: {fontSize: 20, fontFamily: 'uzura_font'},
            text: crop.get('name'),
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE
          });

          row.add(label)
          column.addRow(row);
        });
      }
    });
  } else {
    $.workCollection.fetch({
      success: function() {
        $.workCollection.each(function(work) {
          var row = Ti.UI.createPickerRow();
          var label = Ti.UI.createLabel({
            color: '#464646',
            font: {fontSize: 20, fontFamily: 'uzura_font'},
            text: work.get('name'),
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE
          });
          row.add(label);
          column.addRow(row);
        });
      }
    });
  }
  $.picker.columns.push(column);

  $.pickerView.setVisible(true);

  var animate = Ti.UI.createAnimation({
    bottom: 0,
    duration: 300
  });

  $.pickerView.animate(animate);
};

function resetValue() {
  Ti.API.debug(this.name);
};

function hidePicker() {
  var animate = Ti.UI.createAnimation({
    bottom: '-100%',
    duration: 300
  });

  $.pickerView.animate(animate, function() {
    $.pickerView.setVisible(false);
  });
};

var value;
function getPickerValue(e) {
  value = $.picker.columns[e.columnIndex].rows[e.rowIndex].title;
  Ti.API.debug(e.row.title);
  Ti.API.debug(value);
};

function doneClick() {
  hidePicker();
};

// 表示されたキーボードのオーナーを格納
function setKeyboardOwner(e) {
  currentKeyboardOwner = e.source;
  e.cancelBubble = true;
};

// キーボードを閉じる
function hideKeyboard() {
  Ti.API.debug(typeof(currentKeyboardOwner));
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

function updateUI() {
  $.photoRecord.fetch({
    success: function() {
      updatePhotoList();
      updatePhotoDetail();
    }
  });
};

$.photoRecord.fetch();
