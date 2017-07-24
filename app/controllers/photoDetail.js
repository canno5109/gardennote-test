var args = $.args;


function cleanup() {
  $.destroy();
};

function closeWin() {
  $.photoDetailWin.close();
};

function showOptionDialog() {
  $.optionDialog.show();
};

function clickOptionDialog(e) {
  switch (e.index) {
    case 0:
      var item = $.photoListSection.getItemAt($.photoDetailScrollableView.getCurrentPage());
      var name = item.name.text;
      var work = item.properties.workValue;
      var date = item.properties.dateValue;
      var note= item.note.text;

      $.cropField.setValue(name);
      $.workField.setValue(work);
      $.noteArea.setValue(note);

      $.editPhotoContainer.setVisible(true);
      var animate = Ti.UI.createAnimation({
        right: 0,
        duration: 250
      });
      $.editPhotoContainer.animate(animate);
      break;
    case 1:
      var photoId = $.photoDetailScrollableView.getViews()[$.photoDetailScrollableView.getCurrentPage()].photoId;
      Alloy.Collections.photoRecord.fetch({
        query: {
          statement: 'SELECT * FROM photoRecord WHERE id = ?',
          params: [photoId]
        },
        success: function() {
          var photoRecordModel = Alloy.Collections.photoRecord.first();
          photoRecordModel.destroy();
          $.photoListWin.setFullscreen(false);
          Alloy.Globals.tabGroup.add(Alloy.Globals.customCameraContainer);
          Alloy.Globals.tabGroup.animate({bottom: 0, duration: 0});
          var closeAnimation = Ti.UI.createAnimation({
            bottom: '-100%',
            duration: 250
          });
          $.photoDetailContainer.animate(closeAnimation, function() {
            $.photoDetailContainer.setVisible(false);
          });

          Alloy.Globals.photoUpdate = true;
          Alloy.Globals.updateUI();
        }
      });
      break;
    default:
      break;
  }
  this.setTintColor('#009900');
};
