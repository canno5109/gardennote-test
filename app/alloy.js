Alloy.Globals.moment = require('alloy/moment');

Alloy.Globals.tabGroup;
Alloy.Globals.customCameraContainer; // カメラボタンのcontainer
Alloy.Globals.photoListNavigationWindow; // 写真一覧画面のNavWin
Alloy.Globals.recordPropertiesNavigationWindow; // 記録設定画面のNavWin
Alloy.Globals.cameraOptionNavigationWindow; // 記録設定画面のNavWin

Alloy.Globals.updateRecordProperties;

Alloy.Globals.updatePhotoList; // 写真一覧画面更新
Alloy.Globals.showCamera; // カメラ起動


Alloy.CFG.photoItemSize = Ti.Platform.displayCaps.platformWidth * 0.95;

Alloy.Globals.CompressQuality = 0.75;

if (!Ti.App.Properties.getBool("imageCompressed")) {
  var photoRecord = Alloy.createCollection("photoRecord");
  photoRecord.fetch({
    success: function() {
      photoRecord.each(function(item) {
        item.set({
          photo: item.get("photo").imageAsCompressed(Alloy.Globals.CompressQuality)
        }).save();

        Ti.App.Properties.setBool("imageCompressed", true);
      });
    }
  });
}
