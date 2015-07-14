/**
 * Created by michal on 14.07.15.
 */
var WIFI_INFO = 'wifiInfo-esp8266';

var SpecialMsgHandler = function () {
    this.info = {};
    this.info.wifi = {};

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
SpecialMsgHandler.prototype.tryHandleAsyncMsg = function (msg) {
    var handled = true;

    /*
     wifiInfo-esp8266(WPA_WPA2_PSK,"r8F86",-87 dBm,"c0:4a:00:87:4d:11",1)
     */
    if (msg.content.indexOf(WIFI_INFO) != -1) {
        var r = new RegExp('wifiInfo-esp8266\\((.*),"(.*)",([+-]?[0-9]+) dBm,"([:a-zA-Z0-9]*)",([0-9]+)\\)');
        var m = r.exec(msg.content);

        var auth = m[1], ssid = m[2], dBm = m[3], mac = m[4], chanel = m[5];
        this.info.wifi[ssid] = {
            auth: auth,
            dBm: dBm,
            mac: mac,
            chanel: chanel,
            quality: util.dBmToPercent(parseInt(dBm))
        };
        console.log(this.info)
    } else {
        handled = false;
    }


    return handled;
};

module.exports = SpecialMsgHandler;