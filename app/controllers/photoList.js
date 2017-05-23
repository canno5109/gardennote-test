var args = $.args;
var currentKeyboardOwner = undefined;
var photoListItems = [];
var detailPhotoItems = [];
Alloy.Globals.photoListNavigationWindow = $.photoListNav;

function setPhotoListItem() {
  $.photoDetailScrollableView.setViews([]);
  Alloy.Collections.photoRecord.fetch({
    success: function() {
      Alloy.Collections.photoRecord.each(function(record) {
        var name = record.get('name') == null ? '無名の作物' : record.get('name');
        var workValue = record.get('work');
        var work = workValue == null ? '農作業：未入力' : '農作業: ' + workValue;
        var dateValue = record.get('date');
        var date = '記録日: ' + Alloy.Globals.moment(dateValue, 'YYYY-MM-DD HH:mm:ss').format('YYYY年M月D日');
        var note = record.get('note') == null ? 'メモがありません' : record.get('note');

        var photoListItem = {
          template: 'photoListTemplate',
          photo: {image: record.get('photo')},
          name: {text: name},
          work: {text: work},
          date: {text: date},
          note: {text: note},
          workValue: workValue,
          dateValue: dateValue,
        };

        var detailPhotoItem = {
          photoId: record.get('id'),
          photo: record.get('photo'),
          date: Alloy.Globals.moment(dateValue, 'YYYY-MM-DD HH:mm:ss').format('YYYY.MM.DD H:mm'),
          name: name
        };

        photoListItems.push(photoListItem);
        detailPhotoItems.push(detailPhotoItem);
      });
      $.photoListSection.setItems(photoListItems);
      photoListItems = [];
      setupPhotoDetail();
    }
  });
};

function setupPhotoDetail() {
  _.each(detailPhotoItems, function(item, itemIndex) {
    var photoBody = Ti.UI.createView({photoId: item.photoId});

    photoBody.add(Ti.UI.createLabel({
      text: item.date,
      top: 20,
      font: {
        fontSize: 18,
        fontFamily: 'uzura_font'
      },
      color: '#FFFFFF',
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      width: Ti.UI.FILL,
      height: 15,
      left: 50,
      right: 50
    }));

    photoBody.add(Ti.UI.createLabel({
      text: item.name,
      top: 40,
      font: {
        fontSize: 16,
        fontFamily: 'uzura_font'
      },
      color: '#FFFFFF',
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      width: Ti.UI.FILL,
      height: 15,
      left: 50,
      right: 50
    }));

    var zoomScale = getZoomScale(item.photo);

    var photoDetailScrollView = Ti.UI.createScrollView({
      width: Ti.UI.FILL,
      height: Ti.UI.FILL,
      maxZoomScale: 1,
      minZoomScale: zoomScale,
      zoomScale: zoomScale
    });

    photoDetailScrollView.add(Ti.UI.createImageView({
      image: item.photo,
      width: Ti.UI.SIZE,
      height: Ti.UI.SIZE,
      backgroundColor: '#FFFFFF'
    }));
    photoBody.add(photoDetailScrollView);

    $.photoDetailScrollableView.addView(photoBody);
  });

  detailPhotoItems = [];
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
      setPhotoListItem();
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
  setPhotoListItem();
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
          setPhotoListItem();
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
        name: $.nameField.value,
        work: $.workField.value,
        note: $.noteArea.value
      });
      photoRecordModel.save(null, {
        success: function() {
          setPhotoListItem();
          $.photoDetailScrollableView.setCurrentPage(currentPage);
          hideEditPhotoView();
        }
      });
    }
  });
};

function openPicker() {
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
