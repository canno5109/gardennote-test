var args = $.args;


function takePicture() {
  Ti.Media.takePicture();
};

function closeCamera() {
  Ti.Media.hideCamera();
};
