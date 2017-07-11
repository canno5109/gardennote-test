if (!Ti.App.Properties.getBool('initialActivation')) {
  Ti.App.Properties.setObject('recordProperties', {
    name: 'りんご',
    work: '摘果',
    theme: ''
  });
  Ti.App.Properties.setBool('initialActivation', true);
}

// Alloy.createController('tab').getView().open();
Alloy.createController('register').getView().open();
