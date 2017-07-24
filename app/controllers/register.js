var args = $.args;
var currentKeyboardOwner = undefined;
var selectionDate = Alloy.Globals.moment().format('YYYY/M/D');

function cleanup() {
  $.destroy();
};

function closeWin() {
  hideKeyboard();
  $.registerWin.close();
};

function setDefaultRegisterData() {
  $.userNameForm.setValue(Ti.App.Properties.getString('user_name'));
  $.dateForm.setText(selectionDate);
};

function openDatePicker() {
  $.datePickerBox.setVisible(true);
};

function setDate(e) {
  selectionDate = e.value.getFullYear() + '/' + (e.value.getMonth() + 1) + '/' + e.value.getDate();
};

function datePickerCancelClick() {
  $.datePickerBox.setVisible(false);
};

function datePickerDoneClick() {
  $.datePickerBox.setVisible(false);
  $.dateForm.setText(selectionDate);
};

function saveData() {
  if ($.userNameForm.value === '') {
    Ti.UI.createAlertDialog({title: 'お知らせ', message: '登録者を入力してください'}).show();
    return;
  }

  if ($.cropForm.value === '') {
    Ti.UI.createAlertDialog({title: 'お知らせ', message: '作物名を入力してください'}).show();
    return;
  }

  if ($.workForm.value === '') {
    Ti.UI.createAlertDialog({title: 'お知らせ', message: '農作業名を入力してください'}).show();
    return;
  }

  var date = Alloy.Globals.moment($.dateForm.text, 'YYYY/M/D').format('YYYY-MM-DD');
  var work_reason = $.workReasonForm.value === '農作業を実施した理由を入力してください' ? '' : $.workReasonForm.value;
  var technical_supplement = $.technicalSupplementForm.value === '実施した農作業の具体的な説明を記入してください' ? '' : $.technicalSupplementForm.value;
  var consideration = $.considerationForm.value === '記録の考察を記入してください' ? '' : $.considerationForm.value;
  var evidence = '';

  var photoRecord = Alloy.createModel('photoRecord', {
    user_name: $.userNameForm.value,
    date: date,
    crop_name: $.cropForm.value,
    work: $.workForm.value,
    work_reason: work_reason,
    technical_supplement: technical_supplement,
    consideration: consideration,
    evidence: evidence,
    photo: args.photo
  });
  photoRecord.save(null, {
    success: function() {
      closeWin();
      Alloy.Globals.cameraOptionNavigationWindow.close();
    }
  });
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

