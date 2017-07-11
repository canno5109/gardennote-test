if (!Ti.App.Properties.getBool('initialActivation')) {
  Alloy.createController('initialSetting').getView().open();
} else {
  Alloy.createController('tab').getView().open();
}

