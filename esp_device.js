/**
 * Created by michal on 24.06.15.
 */

var util = require('util');
var my_tcp_bus = require('./my_tcp_bus');
var con = require('./my_console').get('EspDevice');
var KeepAlive = require("./keep_alive");


/***
 *
 * @param {EspDevice~cfg} cfg
 * @class
 */
var EspDevice = function (cfg) {
    // call super constructor
    EspDevice.super_.call(this, cfg.ip, cfg.port);
    // create keep alive
    new KeepAlive(this);

    this.cfg = cfg;
    con.log('Created device for cfg:', cfg);

};
util.inherits(EspDevice, my_tcp_bus);



module.exports = EspDevice;

/***
 * @typedef {Object} EspDevice~cfg
 * @property {string} ip
 * @property {number} port
 * @property {string} name
 * @property {string} description
 *
 */