var args = $.args;
var currentKeyboardOwner = undefined;


var user_name = args.user_name;
var date = Alloy.Globals.moment(args.date, 'YYYY-MM-DD').format('YYYY/M/D');
var selectionDate = date;
var crop_name = args.crop_name;
var work = args.work;
var work_reason = args.work_reason == '' ? $.workReasonForm.value : args.work_reason;
var technical_supplement = args.technical_supplement == '' ? $.technicalSupplementForm.value : args.technical_supplement;
var consideration = args.consideration == '' ? $.considerationForm.value : args.consideration;

$.userNameForm.setValue(user_name);
$.dateForm.setText(date);
$.cropForm.setValue(crop_name);
$.workForm.setValue(work);
$.workReasonForm.setValue(work_reason);
$.technicalSupplementForm.setValue(technical_supplement);
$.considerationForm.setValue(consideration);

function cleanup() {
  $.destroy();
};

function closeWin() {
  hideKeyboard();
  $.editRegister.close();
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

function updateData() {
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

  $.cropModel.fetch({
    query: {
      statement: 'SELECT * FROM photoRecord WHERE id = ?',
      params: [args.itemId]
    },
    success: function() {
      var date = Alloy.Globals.moment($.dateForm.text, 'YYYY/M/D').format('YYYY-MM-DD');
      var work_reason = $.workReasonForm.value === '農作業を実施した理由を入力してください' ? '' : $.workReasonForm.value;
      var technical_supplement = $.technicalSupplementForm.value === '実施した農作業の具体的な説明を記入してください' ? '' : $.technicalSupplementForm.value;
      var consideration = $.considerationForm.value === '記録の考察を記入してください' ? '' : $.considerationForm.value;


      var photoRecordCollection = $.cropModel.first();
      photoRecordCollection.set({
        user_name: $.userNameForm.value,
        date: date,
        crop_name: $.cropForm.value,
        work: $.workForm.value,
        work_reason: work_reason,
        technical_supplement: technical_supplement,
        consideration: consideration
      });

      photoRecordCollection.save(null, {
        success: function() {
          Alloy.Globals.updatePhotoList();
          closeWin();
        }
      });
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

