var args = $.args;
var image;
var deviceName = '紫波町中村農園';
// 岩手県立大学ソフトウェア情報学部A棟

function closeWin() {
  $.midoriBox.close();
};

// ログインセッションを生成
function createLoginSession() {
  var url = 'https://midori-cloud.net/api/v2/auth';
  var parameter = { mail_addr: 'takagi-m@iwate-pu.ac.jp', password: 'midori-t@k@gi' };

  var client = Ti.Network.createHTTPClient({
    onload: function(e) {
      var json = JSON.parse(this.responseText);
      Ti.API.info(JSON.stringify(json));

      var user_id = json.user_id;
      // $.userId.setText(user_id);

      getDevice(user_id);
    },
    onerror: function(e) { Ti.API.debug(e.error); }
  });

  client.open('POST', url);
  client.send(parameter);
  client = null;
};

// デバイス（みどりクラウド）の取得
function getDevice(user_id) {
  var url = 'https://midori-cloud.net/api/v4/device_list';
  var parameter = { user_id: user_id };

  var client = Ti.Network.createHTTPClient({
    onload: function(e) {
      var json = JSON.parse(this.responseText);
      Ti.API.info(JSON.stringify(json));

      _.each(json, function(device) {
        if (device.device_name === deviceName) {
          var device_id = device.id;
          Ti.API.debug('device_id: ' + device_id);
          // $.deviceId.setText(device_id);
          getMeasuredValue(user_id, device_id);
        }
      });
    },
    onerror: function(e) { Ti.API.debug(e.error); }
  });

  client.open('POST', url);
  client.send(parameter);
  client = null;
};

function getMeasuredValue(user_id, device_id) {
  var url = 'https://midori-cloud.net/api/v4/device_detail';
  var parameter = { user_id: user_id, device_id: device_id };

  var client = Ti.Network.createHTTPClient({
    onload: function(e) {
      var json = JSON.parse(this.responseText);
      Ti.API.info('hardware_version: ' + json.hardware_version);
      Ti.API.info('device_name: ' + json.device_name);
      // $.deviceName.setText(json.device_name);
      Ti.API.info('update: ' + json.update);
      Ti.API.info('alert: ' + json.alert);
      Ti.API.info('satus: ' + json.status);
      Ti.API.info('img_exists: ' + json.img_exists);

      var items = json.items;
      _.each(items, function(item) {
        Ti.API.info(item.label);
        Ti.API.info(JSON.stringify(item) + '\n\n');
      });

      getImages(device_id);
    },
    onerror: function(e) {
      Ti.API.debug(e.error);
      alert('error');
    }
  });

  client.open('POST', url);
  client.send(parameter);
  client = null;
};

function getImages(device_id) {
  var url = 'https://midori-cloud.net/api/v4/get_img?device=' + device_id;
  var client = Ti.Network.createHTTPClient({
    onload: function() {
      image = this.responseData;
      $.image.setImage(image);
    },
    onerror: function(e) {
      Ti.API.debug(e.error);
    }
  });
  client.open('GET', url);
  client.setRequestHeader('charset','utf-8');
  client.send();
  client = null;
};

function savePhoto() {
  Ti.Media.saveToPhotoGallery(image, {
    success: function() {
      alert('保存しました。');
    }
  });
};