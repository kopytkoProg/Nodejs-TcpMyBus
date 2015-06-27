/**
 * Created by michal on 14.06.15.
 */
var cons = require("./my_console").get('KeepAlive');


var TIME = 2 * 1000;
var MARGIN = 200;
var CMD = '{keepAlive-esp8266}';


/***
 *
 * @param {TcpMyBus} tmb
 * @constructor KeepAlive
 */
var KeepAlive = function (tmb) {

    var now = function () {
        return new Date().getTime();
    };

    var inProgress = false;

    var setupTimer = function () {
        var nextTimeout = TIME - (now() - tmb.getLastActivity());
        nextTimeout = Math.max(nextTimeout, 0);
        if (!inProgress) setTimeout(keepAlive, nextTimeout);
    };


    var keepAlive = function () {
        if (now() - tmb.getLastActivity() >= TIME - MARGIN) {
            inProgress = true;
            cons.log('KeepAlive sent');
            tmb.send(CMD, function (err, msg) {
                if (err) cons.log('KeepAlive response err: ' + err);
                else cons.log('KeepAlive response: ' + msg);

                inProgress = false;
                setupTimer();
            });
        } else {
            setupTimer();
        }
    };

    setupTimer();

};


module.exports = KeepAlive;