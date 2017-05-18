var args = $.args;
Alloy.Globals.photoListNavigationWindow = $.photoList;
$.photoDetailContainer.hide();
$.editPhotoContainer.hide();

function transformPhotoList(model) {
  var transform = model.toJSON();
  transform.name = transform.name == null ? '無名の作物' : transform.name;
  transform.work = transform.work == null ? '農作業: 未入力' : '農作業: ' + transform.work;
  transform.date = '記録日: ' + Alloy.Globals.moment(transform.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY年M月D日');
  transform.note = transform.note == null ? 'メモがありません' : transform.note;
  return transform;
};

function filterPhotoList(collection) {
  return collection.models;
};

function transformPhotoDetail(model) {
  var transform = model.toJSON();
  transform.date = Alloy.Globals.moment(transform.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY.MM.DD H:mm');

  var zoomScale;
  if (transform.photo.width != null) {
    var widthScale = 1 / Math.ceil(transform.photo.width / Ti.Platform.displayCaps.platformWidth);
    var heightScale = 1 / Math.ceil(transform.photo.height / Ti.Platform.displayCaps.platformHeight);
    zoomScale = widthScale >= heightScale ? heightScale : widthScale;
    if (zoomScale < 0.5) {
      widthScale = 1 / (transform.photo.width / Ti.Platform.displayCaps.platformWidth);
      heightScale = 1 / (transform.photo.height / Ti.Platform.displayCaps.platformHeight);
      zoomScale = widthScale >= heightScale ? heightScale : widthScale;
    }
  } else {
    zoomScale = 0.5;
  }
  transform.zoomScale = zoomScale;
  return transform;
};

function filterPhotoDetail(collection) {
  return collection.models;
};

function refreshPhotoCollection() {
  Alloy.Collections.photoRecord.fetch();
  updatePhotoList();
  updatePhotoDetail();
};

function showPhotoDetail(e) {
  Alloy.Globals.tabGroup.animate({bottom: -50, duration: 0});
  Alloy.Globals.tabGroup.remove(Alloy.Globals.customCameraContainer);
  $.photoDetailScrollableView.setCurrentPage(e.itemIndex);
  $.photoListWin.setFullscreen(true);
  $.photoDetailContainer.show();
};

function addPhoto() {
  Ti.Media.openPhotoGallery({
    success: function(e) {
      var image1 = Ti.UI.createImageView({
        image: e.media,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL
      }).toImage(null, true);

      var image2 = image1.imageAsResized(150, 200);

      var date = Alloy.Globals.moment().format('YYYY-MM-DD HH:mm:ss');
      Alloy.createModel('photoRecord', {
        name: Ti.App.Properties.getObject('recordProperties').name,
        photo: image2,
        date: date,
        work: Ti.App.Properties.getObject('recordProperties').work,
        note: null
      }).save();
      refreshPhotoCollection();
    },
    error: function(e) {},
    mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO,
    autoHide: true,
    animated: true,
    allowEditing: false
  });
};

function hidePhotoDetailView() {
  $.photoListWin.setFullscreen(false);
  Alloy.Globals.tabGroup.add(Alloy.Globals.customCameraContainer);
  Alloy.Globals.tabGroup.animate({bottom: 0, duration: 0});
  $.photoDetailContainer.hide();
  refreshPhotoCollection();
};

function deleteCrop() {
  $.confirmDialog.show();
};

function confirmDeleteCrop(e) {
  if (e.index == 1) {
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
        $.photoDetailContainer.hide();
        refreshPhotoCollection();
      }
    });
  }
};

Alloy.Collections.photoRecord.fetch();
