/**
 * Created by michal on 24.06.15.
 */

var util = require('util');
var my_tcp_bus = require('./../my_tcp_bus/my_tcp_bus');
var con = require('./../my_console').get('EspDevice');
var KeepAlive = require("./../keep_alive");
var SpecialMsgHandler = require('./../esp_device/special_msg_handler');
var EventEmitter = require('events').EventEmitter;





/***
 * @augments TcpMyBus
 * @param {EspDevice~cfg} cfg
 * @class
 *
 */
var EspDevice = function (cfg) {
    // call super constructor
    EspDevice.super_.call(this, cfg.ip, cfg.port);
    // create keep alive
    new KeepAlive(this);

    this.cfg = cfg;
    // this.asyncEventEmitter = new EventEmitter();
    con.log('Created device for cfg:', cfg);

    new SpecialMsgHandler(this);
};
util.inherits(EspDevice, my_tcp_bus);


EspDevice.prototype.SPECIAL_COMMANDS = {
    /** run wifi scanning. Response will come asynchronously (it start with 'wifiInfo-esp8266') */
    scanNetwork: 'scanNetwork-esp8266',
    /** return mac address */
    getMacInfo: 'getMacInfo-esp8266'
};

EspDevice.prototype.AVR_COMMANDS = {
    /** return hello-avr */
    helloAvr: 'hello-avr'
};



module.exports = EspDevice;

/***
 * @typedef {Object} EspDevice~cfg
 * @property {string} ip
 * @property {number} port
 * @property {string} name
 * @property {string} description
 *
 */