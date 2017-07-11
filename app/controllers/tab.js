var args = $.args;
Alloy.Globals.tabGroup = $.tabGroup;

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

cameraBtn.addEventListener('singletap', function() {
  if (!ENV_DEV) {
    var cameraWin = Alloy.createController('camera').getView();
    $.tabGroup.close();
    setTimeout(function() {
      cameraWin.open();
    }, 500);
  }
});

Alloy.Globals.customCameraContainer.add(tabCover);
Alloy.Globals.customCameraContainer.add(cameraBtnShadow);
Alloy.Globals.customCameraContainer.add(cameraBtnContainer);
$.tabGroup.add(Alloy.Globals.customCameraContainer);

function cleanup() {
  $.destroy();
};
