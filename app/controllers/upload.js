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
  if (typeof(currentKeyboardOwner) !== "undefined") {
    currentKeyboardOwner.blur();
  }
};

function upload() {
  let url = "http://agri-manages-record.herokuapp.com/records";
  $.workCollection.fetch({
    query: {
      statement: "SELECT *, upload as upload2 FROM photoRecord WHERE upload IS NULL OR upload2 = ?",
      params: [false]
    },
    success: function() {
      $.workCollection.each(function(item, itemIndex) {
        Ti.API.debug('alloy_id: ' + item.get('alloy_id'));
        var file =  item.get("photo").imageAsCompressed(Alloy.Globals.CompressQuality)
        Ti.API.debug("mimeType : " + file.mimeType);
        Ti.API.debug("width : " + file.width);
        Ti.API.debug("height : " + file.height);
        Ti.API.debug("size : " + file.size);

        let params = {
          user_id: Ti.App.Properties.getObject("user").id,
          crop_name: item.get("crop_name"),
          date: item.get("date"),
          work_name: item.get("work"),
          work_reason: item.get("work_reason"),
          technical_supplement: item.get("technical_supplement"),
          consideration: item.get("consideration"),
          file: file,
          filename: file.mimeType,
          record_id: item.get("id")
        };
        Ti.API.debug(JSON.stringify(params));

        let client = Ti.Network.createHTTPClient({
          onload: function(e) {
            Ti.API.debug("e: " + JSON.stringify(e));
            Ti.API.debug("#" + itemIndex + " was Succeed!");

            item.set({
              upload: true
            }).save();

            if (itemIndex == $.workCollection.length - 1) {
              Ti.UI.createAlertDialog({title: "成功", message: "アップロードが完了しました"}).show();
            }
          },
          onerror: function(e) {
            Ti.API.debug("e: " + JSON.stringify(e));
            if (e.code == 500) {
              Ti.UI.createAlertDialog({title: "アップロード失敗", message: "もう一度やり直してください"}).show();
            } else {
              let json = JSON.parse(this.responseText);
              Ti.API.debug(json);
              Ti.UI.createAlertDialog({title: "アップロード失敗", message: json.message}).show();
            }
            Ti.API.debug(e);
          },
          timeout: 5000
        });

        client.open("POST", url, false);
        client.send(JSON.stringify(params));
        client = null;
      });
    },
    error: function() {}
  });
};
