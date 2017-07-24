var args = $.args;
Alloy.Globals.photoListNavigationWindow = $.photoListNav;


function cleanup() {
  $.destroy();
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
  var photoDetailWin = Alloy.createController('photoDetail').getView();
  Alloy.Globals.photoListNavigationWindow.openWindow(photoDetailWin);
  // Alloy.Globals.tabGroup.remove(Alloy.Globals.customCameraContainer);
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
          Alloy.Globals.photoListUpdate = true;
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

function showRecordingFastestMessage() {
  if ($.photoListSection.items.length == 0) {
    $.recordingFastestMessageView.setVisible(true);
  } else {
    $.recordingFastestMessageView.setVisible(false);
  }
};


function transformPhotoList(model) {
  var transform = model.toJSON();
  transform.crop_name = transform.crop_name == null ? '無名の作物' : transform.crop_name;
  var workValue = transform.work;
  transform.work = workValue == null ? '農作業：未入力' : '農作業: ' + workValue;
  var dateValue = transform.date;
  transform.date = '記録日: ' + Alloy.Globals.moment(dateValue, 'YYYY-M-D').format('YYYY年M月D日');
  transform.evidence = transform.evidence == null ? '考察がありません' : transform.evidence;
  transform.workValue = workValue;
  transform.dateValue = dateValue;

  return transform;
};

function filterPhotoList(collection) {
  return collection.models;
};

Alloy.Globals.updatePhotoList = function () {
  Alloy.Collections.photoRecord.fetch({
    success: function() {
      updatePhotoList();
    }
  });
};

Alloy.Collections.photoRecord.fetch();



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
