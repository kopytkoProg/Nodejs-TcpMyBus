/**
 * Created by michal on 13.06.15.
 */

var net = require('net');
var Timeout = require("./timeout");
var cons = require("./my_console").get('AutoReconnect');


var CONNECTION_TIMEOUT = 10 * 1000;         // 3 s
var KEEP_ALIVE = 100;                       // 1 s

//var States = {
//
//};
//
//var state = 1;
/***
 *
 * @param {string} host
 * @param {number} port
 * @param {AutoReconnect~onConnect} onConnect
 * @param {AutoReconnect~onData} onData
 * @param {AutoReconnect~onReconnect} onReconnect
 * @constructor
 */
var AutoReconnect = function (host, port, onConnect, onData, onReconnect) {
    var t = this;
    var cfg = {port: port, host: host};

    var timeout = new Timeout(function () {
        cons.error('Disconnect because of timeout');
        t.connction.destroy();
    }, CONNECTION_TIMEOUT);

    var setListeners = function () {

        t.connction.on('data', function (data) {
            if (onData) onData(data);
            timeout.arm();
        });

        t.connction.on('close', function (err) {
            /*
             Mey be better to wait until someone want to us this connection.
             Eg of use:
             1. send msg
             2. idle
             3. disconnect because of long idle time
             4. send msg so connection should be recreated
             5. ...
             to do it comment line below (and do something else(check in send method if have connection))
             other way connection will be automatically recreated each time it fail
             */
            connect(onReconnect);
        });

        // t.connction.on('timeout', xxx);

        t.connction.on('error', function (error) {
            cons.error('Connection error: ', error);
            t.connction.destroy();
        });

    };

    var connect = function (onConnect) {
        t.connction = net.connect(cfg, function () {
            timeout.arm();
            if (onConnect) onConnect();
        });
        setListeners();
        // t.connction.setTimeout(CONNECTION_TIMEOUT);
        // t.connction.setKeepAlive(true, 0);
    };

    this.send = function (msg) {
        try {
            t.connction.write(msg);
            cons.log('sent')
        } catch (e) {
            cons.error('SendError:', e)
        }
    };

    connect(onConnect);
};

module.exports = AutoReconnect;

/**
 * Called when connected
 * @callback AutoReconnect~onConnect
 */

/**
 * Called when data come
 * @callback AutoReconnect~onData
 */

/**
 * Called when reconnected
 * @callback AutoReconnect~onReconnect
 */