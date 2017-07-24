var args = $.args;

var overlay = Alloy.createController('cameraOverlay').getView();
Alloy.Globals.cameraOptionNavigationWindow = $.cameraOptionNav;
$.closeView.width = $.saveView.width = Math.floor(Ti.Platform.displayCaps.platformWidth / 2);
$.photo.setImage(args.image);

function closeWin() {
  $.cameraOptionNav.close();
  Alloy.Globals.showCamera();
};

function openRegisterWin() {
  var registerWin = Alloy.createController('register', {photo: args.image}).getView();
  Alloy.Globals.cameraOptionNavigationWindow.openWindow(registerWin);
};
