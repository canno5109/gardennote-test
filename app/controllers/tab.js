var args = $.args;
Alloy.Globals.tabGroup = $.tabGroup;
var overlay = Alloy.createController('cameraOverlay').getView();

Alloy.Globals.customCameraContainer = Ti.UI.createView({
  bottom: 0,
  width: Ti.UI.SIZE,
  height: Ti.UI.SIZE
});

var tabCover = Ti.UI.createView({
  bottom: 0,
  width: 120,
  height: 50,
  backgroundColor: 'transparent',
  bubbleParent: false,
  zIndex: 1
});

var cameraBtnShadow = Ti.UI.createView({
  top: 5,
  width: 76,
  height: 76,
  bottom: -20,
  backgroundColor: 'transparent',
  borderRadius: 38,
  viewShadowColor: '#b5b5b5',
  viewShadowOffset: { x: 0, y: 0 },
  bubbleParent: false,
  zIndex: 1
});

var cameraBtnContainer = Ti.UI.createView({
  width: 75,
  height: 75,
  top: 5,
  bottom: -20,
  backgroundColor: '#009900',
  borderColor: '#009900',
  borderRadius: 37.5,
  bubbleParent: false,
  zIndex: 1
});

var cameraBtn = Ti.UI.createButton({
  title: '\uf030',
  color: '#FFFFFF',
  width: 60,
  height: 28,
  top: 15,
  font: {
    fontSize: 28,
    fontFamily: 'FontAwesome'
  }
});

var cameraLabel = Ti.UI.createLabel({
  text: 'カメラ',
  color: '#FFFFFF',
  width: 70,
  height: 10,
  top: 43,
  font: {
    fontSize: 11,
    fontFamily: 'FontAwesome'
  },
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
});

cameraBtnContainer.add(cameraBtn);
cameraBtnContainer.add(cameraLabel);

Alloy.Globals.showCamera = function() {
  if (!ENV_DEV) {
    Ti.Media.showCamera({
      success: function(e) {
        Alloy.createController('cameraOption', {image: e.media}).getView().open({
          modalTransitionStyle: Ti.UI.iOS.MODAL_TRANSITION_STYLE_CROSS_DISSOLVE
        });
      },
      overlay: overlay,
      showControls: false,
      transform: Ti.UI.create2DMatrix().scale(1, 1).translate(0, 70),
      saveToPhotoGallery: false,
      autoHide: false,
      allowEditing: false,
      mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO
    });
  }
};

cameraBtn.addEventListener('singletap', Alloy.Globals.showCamera);

Alloy.Globals.customCameraContainer.add(tabCover);
Alloy.Globals.customCameraContainer.add(cameraBtnShadow);
Alloy.Globals.customCameraContainer.add(cameraBtnContainer);
$.tabGroup.add(Alloy.Globals.customCameraContainer);

function cleanup() {
  $.destroy();
};
