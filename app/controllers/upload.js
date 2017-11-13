var args = $.args;
var currentKeyboardOwner = undefined;

function closeWin() {
  $.upload.close();
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

function upload() {
  var url = "153.126.145.101/~g031m059/system/record";
  var params = {
    user_name: "canno",
    crop_name: "Apple",
    date: null,
    work_name: null,
    work_reason: null,
    technical_supplement: null,
    consideration: null,
    evidence: null,
    photo: null
  };

  var xhr = Ti.Network.createHTTPClient({
    onload: function() {
      Ti.UI.createAlertDialog({message: 'アップロードが完了しました'}).show();
    },
    onerror: function(e) {
      Ti.API.debug(e.error);
    }
  });

  xhr.open('POST', url, false);
  // xhr.setRequestHeader('access_token', access_token);
  xhr.send(params);
  xhr = null;
};
