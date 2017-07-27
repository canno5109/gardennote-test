var args = $.args;
Alloy.Globals.photoListNavigationWindow = $.photoListNav;


function cleanup() {
  $.destroy();
};

function showRecordingFastestMessage() {
  if ($.photoListSection.items.length == 0) {
    $.recordingFastestMessageView.setVisible(true);
  } else {
    $.recordingFastestMessageView.setVisible(false);
  }
};

// 表示されたキーボードのオーナーを格納
function setKeyboardOwner(e) {
  currentKeyboardOwner = e.source;
  e.cancelBubble = true;
};

// キーボードを閉じる
function hideKeyboard() {
  if (typeof(currentKeyboardOwner) !== 'undefined') {
    currentKeyboardOwner.blur();
  }
};

function openPhotoDetail(e) {
  $.photoDetailContainer.animate($.upAnimation);
  $.photoSlide.setCurrentPage(e.itemIndex);
};

var overlay = Alloy.createController('cameraOverlay').getView();
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

function addPhoto() {
  Ti.Media.openPhotoGallery({
    success: function(e) {
      var photoRecordModel = Alloy.createModel('photoRecord', {
        user_name: Ti.App.Properties.getString('user_name'),
        date: Alloy.Globals.moment().format('YYYY-MM-DD'),
        crop_name: 'りんご',
        work: '摘果',
        work_reason: '',
        technical_supplement: '',
        consideration: '',
        evidence: '',
        photo: e.media
      });

      photoRecordModel.save(null, {
        success: function() {
          Alloy.Globals.updatePhotoList();
        }
      });
    },
    mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO,
    autoHide: true,
    animated: true,
    allowEditing: false
  });
};

function transformPhotoList(model) {
  var transform = model.toJSON();
  transform.date = Alloy.Globals.moment(transform.date, 'YYYY-MM-DD').format('YYYY年M月D日');

  var ratio, referenceSize, referenceSizeName;
  if (transform.photo.width > transform.photo.height) {
    referenceSizeName = 'width';
    referenceSize = transform.photo.width;
    ratio = transform.photo.width / transform.photo.height;
  } else {
    referenceSizeName = 'height';
    referenceSize = transform.photo.height;
    ratio = transform.photo.height / transform.photo.width;
  }

  var widthSize, heightSize;
  if (referenceSize > Alloy.CFG.photoItemSize) {
    if (referenceSizeName == 'width') {
      widthSize = Alloy.CFG.photoItemSize;
      heightSize = Alloy.CFG.photoItemSize / ratio;
    } else {
      widthSize = Alloy.CFG.photoItemSize / ratio;
      heightSize = Alloy.CFG.photoItemSize;
    }
  } else {
    if (referenceSizeName == 'width') {
      widthSize = referenceSize;
      heightSize = referenceSize / ratio;
    } else {
      widthSize = referenceSize / ratio;
      heightSize = referenceSize;
    }
  }

  var pictImage = Ti.UI.createImageView({
    image: transform.photo,
    width: Ti.UI.SIZE,
    height: Ti.UI.SIZE
  });

  var cropView = Ti.UI.createView({
    width: widthSize,
    height: heightSize
  });

  cropView.add(pictImage);

  transform.photo = cropView.toImage();

  return transform;
};

function filterPhotoList(collection) {
  return collection.models;
};

Alloy.Globals.updatePhotoList = function () {
  Alloy.Collections.photoRecord.fetch({
    success: function() {
      updatePhotoList();
      updatePhotoDetail();
    }
  });
};



/* 写真詳細 */
function hidePhotoDetail() {
  $.photoDetailContainer.animate($.downAnimation);
};

function transformPhotoDetail(model) {
  var transform = model.toJSON();

  var photo = transform.photo;
  var widthScale = 1 / Math.ceil(photo.width / Ti.Platform.displayCaps.platformWidth);
  var heightScale = 1 / Math.ceil(photo.height / Ti.Platform.displayCaps.platformHeight);
  var zoomScale = widthScale >= heightScale ? heightScale : widthScale;

  if (zoomScale < 0.5) {
    widthScale = 1 / (photo.width / Ti.Platform.displayCaps.platformWidth);
    heightScale = 1 / (photo.height / Ti.Platform.displayCaps.platformHeight);
    zoomScale = widthScale >= heightScale ? heightScale : widthScale;
  }

  transform.zoomScale = zoomScale;

  return transform;
};

function filterPhotoDetail(collection) {
  return collection.models;
};

Alloy.Collections.photoRecord.fetch();
