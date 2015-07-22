/**
 * Created by michal on 25.06.15.
 */


var ILogicalDeviceInterface = require('./Interfaces/logical_device_interface');
var util = require('util');

/**
 *
 * @param {SimpleLogicalDevice~cfg} cfg
 * @constructor
 */
var SimpleLogicalDevice = function (cfg) {
    ILogicalDeviceInterface.ensureImplements(this);
    this.cfg = cfg;
};

SimpleLogicalDevice.prototype.getName = function () {
    return this.cfg.name;
};

SimpleLogicalDevice.prototype.getDescription = function () {
    return this.cfg.description;
};

SimpleLogicalDevice.prototype.getEspDev = function () {
    return this.cfg.espDev;
};



module.exports = SimpleLogicalDevice;

/**
 * @typedef {object} SimpleLogicalDevice~cfg
 * @property {EspDevice} espDev
 * @property {string} name
 * @property {string} description
 *
 * */