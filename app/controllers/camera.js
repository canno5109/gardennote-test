var args = $.args;

// var overlay = Alloy.createController('cameraOverlay', {win: $.cameraWin}).getView();

Ti.Media.showCamera({
  success: function(e) {
    Alloy.createController('cameraOption', {image: e.media}).getView().open({
      modalTransitionStyle: Ti.UI.iOS.MODAL_TRANSITION_STYLE_CROSS_DISSOLVE
    });

    Ti.Media.hideCamera();
  },
  overlay: $.overlay,
  showControls: false,
  transform: Ti.UI.create2DMatrix().scale(1, 1).translate(0, 70),
  saveToPhotoGallery: false,
  allowEditing: false,
  mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO
});


function takePicture() {
  Ti.Media.takePicture();
};

function closeCamera() {
  Ti.Media.hideCamera();
  // args.win.close();
  $.camera.close();
};
