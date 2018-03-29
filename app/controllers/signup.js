// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var currentKeyboardOwner = undefined;
var date = new Date();
var selectionDate = Alloy.Globals.moment(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(), 'YYYY-M-D').format('YYYY-MM-DD');
var selectionDateText = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';

$.picker.value = date;

/* メモリリーク解放 */
function cleanup() {
  $.destroy();
};

/* 表示されたキーボードのオーナーを格納 */
function setKeyboardOwner(e) {
  currentKeyboardOwner = e.source;
  e.cancelBubble = true;

  if ($.pickerBol.visible) {
    $.pickerBox.setVisible(false);
  }
};

/* キーボードを閉じる */
function hideKeyboard() {
  if (typeof(currentKeyboardOwner) != 'undefined') {
    currentKeyboardOwner.blur();
  }
};

function showLoadingIndicator() {
  $.loadingIndicator.show();
  $.loadingView.setVisible(true);
};

function hideLoadingIndicator() {
  $.loadingIndicator.hide();
  $.loadingView.setVisible(false);
};

/* ピッカーを表示 */
function openPicker() {
  $.pickerBox.setVisible(true);
  hideKeyboard();
};

/* 日付選択 */
function setDate(e) {
  selectionDate = Alloy.Globals.moment(e.value.getFullYear() + '-' + (e.value.getMonth() + 1) + '-' + e.value.getDate(), 'YYYY-M-D').format('YYYY-MM-DD');
  selectionDateText = e.value.getFullYear() + '年' + (e.value.getMonth() + 1) + '月' + e.value.getDate() + '日';
};

/* Picker 非表示 */
function pickerCancelClick() {
  $.pickerBox.setVisible(false);
};

/* Picker 選択決定 */
function pickerDoneClick() {
  $.pickerBox.setVisible(false);
  $.day_of_birth.setValue(selectionDateText);
};

/* アラート表示関数 */
function showAlert(message) {
  Ti.UI.createAlertDialog({message: message}).show();
};

/* 入力フォームの内容審査 */
function checkFormValue() {
  hideKeyboard();
  $.pickerBox.setVisible(false);

  if ($.idForm.value.length == 0) {
    showAlert('IDが入力されていません');
    return;
  }

  if ($.idForm.value.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/) == null) {
    showAlert('IDは半角英数字で入力してください');
    return;
  }

  if ($.passwordForm.value.length == 0) {
    showAlert('パスワードが入力されていません');
    return;
  }

  if ($.passwordAgainForm.value.length == 0) {
    showAlert('パスワード(確認用)が入力されていません');
    return;
  }

  if ($.passwordForm.value != $.passwordAgainForm.value) {
    showAlert('パスワードが確認用と一致しません');
    return;
  }

  if ($.passwordForm.value.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/) == null) {
    showAlert('パスワードは半角英数字で入力してください');
    return;
  }

  if ($.first_name_kanji.value.length == 0) {
    showAlert('性(漢字)が入力されていません');
    return;
  }

  if ($.first_name_kanji.value.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/) == null) {
    showAlert('性(漢字)は日本語で入力してください');
    return;
  }

  if ($.last_name_kanji.value.length == 0) {
    showAlert('名(漢字)が入力されていません');
    return;
  }

  if ($.last_name_kanji.value.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/) == null) {
    showAlert('名(漢字)は日本語で入力してください');
    return;
  }

  if ($.first_name_kana.value.length == 0) {
    showAlert('性(カナ)が入力されていません');
    return;
  }

  if ($.first_name_kana.value.match(/^[ァ-ヶー]*$/) == null) {
    showAlert('性(カナ)はカタカナで入力してください');
    return;
  }

  if ($.last_name_kana.value == 0) {
    showAlert('名(カナ)が入力されていません');
    return;
  }

  if ($.last_name_kana.value.match(/^[ァ-ヶー]*$/) == null) {
    showAlert('名(カナ)はカタカナで入力してください');
    return;
  }

  if ($.day_of_birth.value.length == 0) {
    showAlert('生年月日を入力してください');
    return;
  }

  showLoadingIndicator();
  signup();
};

/* 新規登録 */
function signup() {
  let url = 'http://agri-manages-record.herokuapp.com/users';

  let query = {
    id: $.idForm.value,
    password: $.passwordForm.value,
    first_name_kanji: $.first_name_kanji.value,
    last_name_kanji: $.last_name_kanji.value,
    first_name_kana: $.first_name_kana.value,
    last_name_kana: $.last_name_kana.value,
    day_of_birth: selectionDate
  };

  Ti.API.debug(JSON.stringify(query));

  let client = Ti.Network.createHTTPClient({
    onload: function(e) {
      Ti.App.Properties.setObject('user', {
        id: $.idForm.value,
        password: $.passwordForm.value,
        first_name_kanji: $.first_name_kanji.value,
        last_name_kanji: $.last_name_kanji.value,
        first_name_kana: $.first_name_kana.value,
        last_name_kana: $.last_name_kana.value,
        day_of_birth: selectionDate,
        theme: null
      });
      Ti.App.Properties.setBool('signup', true);

      $.signupWin.close();
      hideLoadingIndicator();
    },
    onerror: function(e) {
      Ti.API.debug('e: ' + JSON.stringify(e));
      if (e.code == 500) {
        Ti.UI.createAlertDialog({title: '登録失敗', message: 'もう一度やり直してください'}).show();
      } else {
        let json = JSON.parse(this.responseText);
        Ti.API.debug(json);
        Ti.UI.createAlertDialog({title: '登録失敗', message: json.message}).show();
      }
      hideLoadingIndicator();
    },
    timeout: 5000
  });

  client.open('POST', url, false); // (method, url, async) -> (POST or GET, apiのURL, 非同期通信で処理を行うか)
  client.send(JSON.stringify(query)); // JSON.stringify() 必須
  client = null;
};

