if (!Ti.App.Properties.getObject('user')) {
  Ti.App.Properties.setObject('user', {
    id: null,
    password: null,
    first_name_kanji: null,
    last_name_kanji: null,
    first_name_kana: null,
    last_name_kana: null,
    day_of_birth: null,
    theme: null
  });
}

/* 新規登録をしていなければ新規登録画面を表示、そうでなければタブを表示 */
Alloy.createController('tab').getView().open();

if (!Ti.App.Properties.getBool('signup')) {
  Alloy.createController('signup').getView().open({
    modalTransitionStyle: Titanium.UI.iOS.MODAL_TRANSITION_STYLE_COVER_VERTICAL
  });
}
