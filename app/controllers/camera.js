var args = $.args;
$.editPicture.hide();
$.closeView.width = $.saveView.width = Math.floor(Ti.Platform.displayCaps.platformWidth / 2);
var photo = null;

function showCamera() {
  Ti.Media.showCamera({
    success: function(e) {
      $.photo.setImage(e.media);
      photo = e.media;
      Ti.Media.hideCamera();
      $.editPicture.show();
    },
    cancel: function() {},
    error: function() {},
    overlay: $.cameraContainer,
    showControls: false,
    transform: Ti.UI.create2DMatrix().scale(1, 1).translate(0, 70),
    saveToPhotoGallery: false,
    allowEditing: false,
    mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO
  });
};

function takePicture() {
  Ti.Media.takePicture();
};

function closeCamera() {
  Ti.Media.hideCamera();
  $.cameraWin.close();
  Alloy.createController('tab').getView().open({modal: true});
};

function resetMemory() {
  $.destroy();
};

function hideEditPicture() {
  $.editPicture.hide();
  $.photo.setImage(null);
  photo = null;
  showCamera();
};

function savePhoto() {
  Ti.Media.saveToPhotoGallery(photo, {
    success: function() {
      var date = Alloy.Globals.moment().format('YYYY-MM-DD HH:mm:ss');
      Alloy.createModel('photoRecord', {
        name: Ti.App.Properties.getObject('recordProperties').name,
        photo: photo,
        date: date,
        work: Ti.App.Properties.getObject('recordProperties').work,
        note: null
      }).save(null, {
        success: function() {
          hideEditPicture();
        },
        error: function() {
          alert('写真を保存できませんでした');
        }
      });
    },
    error: function() {
      alert('写真を保存できませんでした');
    }
  });
};
