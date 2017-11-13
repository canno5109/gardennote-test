var args = $.args;
var currentKeyboardOwner = undefined;

function closeWin() {
  $.upload.close();
  $.destroy();
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
  $.workCollection.fetch({
    query: {
      statement: 'SELECT *, upload as upload2 FROM photoRecord WHERE upload IS NULL OR upload2 = ?',
      params: [false]
    },
    success: function() {
      $.workCollection.each(function(item, itemIndex) {
        var url = "153.126.145.101/~g031m059/system/record";

        var params = {
          user_name: Ti.App.Properties.getString('user_name'),
          crop_name: item.get("crop_name"),
          date: item.get("date"),
          work_name: item.get("work"),
          work_reason: item.get("work_reason"),
          technical_supplement: item.get("technical_supplement"),
          consideration: item.get("consideration"),
          evidence: item.get("evidence"),
          photo: item.get("photo")
        };

        var xhr = Ti.Network.createHTTPClient({
          onload: function() {
            Ti.API.debug("#" + itemIndex + " was Succeed!");

            item.set({
              upload: true
            }).save();
          },
          onerror: function(e) {
            Ti.API.debug(e.error);
          }
        });

        xhr.open('POST', url, false);
        // xhr.setRequestHeader('access_token', access_token);
        xhr.send(params);
        xhr = null;
      });
    },
    error: function() {}
  });
};
