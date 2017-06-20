if (!Ti.App.Properties.getBool('initialActivation')) {
  Ti.API.debug('initial');
  var cropModel =  Alloy.createModel('crop', {name: 'りんご'});
  cropModel.save();

  var workModel = Alloy.createModel('work', {name: '摘果', cropId: 1});
  workModel.save();

  Ti.App.Properties.setObject('recordProperties', {
    name: 'りんご',
    work: '摘果',
    cropId: 1,
    workId: 1
  });
  Ti.App.Properties.setBool('initialActivation', true);
}

Alloy.createController('tab').getView().open();
