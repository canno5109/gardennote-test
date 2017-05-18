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
  width: 101,
  height: 101,
  bottom: -20,
  backgroundColor: 'transparent',
  borderRadius: 50.5,
  viewShadowColor: '#b5b5b5',
  viewShadowOffset: { x: 0, y: 0 },
  bubbleParent: false,
  zIndex: 1
});

var cameraBtn = Ti.UI.createButton({
  title: '\uf030',
  color: '#FFFFFF',
  width: 100,
  height: 100,
  top: 5,
  bottom: -20,
  backgroundColor: '#009900',
  borderColor: '#009900',
  borderRadius: 50,
  font: {
    fontSize: 48,
    fontFamily: 'FontAwesome'
  },
  bubbleParent: false,
  zIndex: 1
});

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
Alloy.Globals.customCameraContainer.add(cameraBtn);
$.tabGroup.add(Alloy.Globals.customCameraContainer);

setTimeout(function() {
  $.tabGroup.remove(cameraBtn);
}, 5000);

function resetMemory() {
  $.destroy();
};
