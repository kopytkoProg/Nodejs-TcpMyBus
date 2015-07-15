/**
 * Created by michal on 14.07.15.
 */
var WIFI_INFO = 'wifiInfo-esp8266';


var ASYNC_ACTIONS = {
    WIFI_INFO: ("wifiInfo-esp8266")
};

/***
 *
 * @param {EspDevice} esp_device
 * @constructor
 */
var SpecialMsgHandler = function (esp_device) {
    this.info = {};
    this.info.wifi = {};
    this.esp_device = esp_device;
    var t = this;
    this.esp_device.on(ASYNC_ACTIONS.WIFI_INFO, function(msg){t.wifiInfo.call(t, msg)});

};

var util = {
    dBmToPercent: function (dBm) {
        // dBm to Quality:
        if (dBm <= -100)
            return 0;
        else if (dBm >= -50)
            return 100;
        else
            return 2 * (dBm + 100);
    }
};

/**
 *
 * @param {Msg} msg
 */
SpecialMsgHandler.prototype.wifiInfo = function (msg) {
    var handled = true;

    /*
     wifiInfo-esp8266
     WPA_WPA2_PSK,"r8F86",-87 dBm,"c0:4a:00:87:4d:11",1
     */

    var r = new RegExp('(.*),"(.*)",([+-]?[0-9]+) dBm,"([:a-zA-Z0-9]*)",([0-9]+)');
    var m = r.exec(msg.content);

    var auth = m[1], ssid = m[2], dBm = m[3], mac = m[4], chanel = m[5];
    this.info.wifi[ssid] = {
        auth: auth,
        dBm: dBm,
        mac: mac,
        chanel: chanel,
        quality: util.dBmToPercent(parseInt(dBm))
    };
    console.log(this.info);


    return handled;
};

module.exports = SpecialMsgHandler;