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
  Ti.UI.createAlertDialog({message: '待機中'}).show();

  /*
  var url = ""; // 対応待ち
  var xhr = Ti.Network.createHTTPClient({
    onload: function() {
      Ti.UI.createAlertDialog({message: 'アップロードが完了しました'}).show();
    },
    onerror: function(e) {
      Ti.API.debug(e.error);
    }
  });
  xhr.open('POST', editCrops_url, false);
  xhr.setRequestHeader('access_token', access_token);
  xhr.send(crops_query);
  xhr = null;
  */
};

