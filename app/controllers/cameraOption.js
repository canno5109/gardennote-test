var args = $.args;

var overlay = Alloy.createController('cameraOverlay').getView();
Alloy.Globals.cameraOptionNavigationWindow = $.cameraOptionNav;
$.closeView.width = $.saveView.width = Math.floor(Ti.Platform.displayCaps.platformWidth / 2);
$.photo.setImage(args.image);

function closeWin() {
  $.cameraOptionNav.close();
  Alloy.Globals.showCamera();
  $.destroy();
};

function openRegisterWin() {
  var image = args.image.imageAsCompressed(Alloy.Globals.CompressQuality);
  var registerWin = Alloy.createController('register', {photo: image}).getView();
  Alloy.Globals.cameraOptionNavigationWindow.openWindow(registerWin);
};
