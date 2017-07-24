if (!Ti.App.Properties.getBool('initialActivation')) {
  Alloy.createController('initialSetting').getView().open({
    modalTransitionStyle: Ti.UI.iOS.MODAL_TRANSITION_STYLE_CROSS_DISSOLVE
  });
} else {
  Alloy.createController('tab').getView().open();
}

