/**
 * Created by michal on 19.07.15.
 */

var util = require('util');
var con = require('./../my_console').get('EspTempSensorDeviceDevice');
var EspDevice = require('./esp_device');
var EventEmitter = require('events').EventEmitter;
var myUtils = require('./../utils');

var STATUS = {};

/***
 * @augments EspDevice
 * @param {EspDevice~cfg} cfg
 * @class
 *
 */
var EspTempSensorsDevice = function (cfg) {
    /* super ctor call*/
    EspTempSensorsDevice.super_.call(this, cfg);


    /** return ds18x20 sensor list */
    this.AVR_COMMANDS.getSensorsId = 'get-sensor-id-avr';
    this.AVR_COMMANDS.getTemp = 'get-temp-avr';
    /*---------------------------------------------------*/
    this.sensorsInfo = {lastUpdate: 0, sensors: []};
    this.events = new EventEmitter();

};
util.inherits(EspTempSensorsDevice, EspDevice);

EspTempSensorsDevice.prototype.getSensorsId = function () {
    this.send(this.AVR_COMMANDS.getSensorsId, function (err, msg) {
        if (err) return con.error(err);

        /* 28:ff:da:60:62:14:03:e4, 28:ff:5c:79:62:14:03:18, 10:ef:a0:6f:01:08:00:12 */
        msg.split(', ').forEach(function (id) {
            this.sensorsInfo.sensors.push(id);
        }, this);

        this.sensorsInfo.lastUpdate = new Date().getTime();
        this.events.emit('sensorsListReceived');

        con.log('sensorsInfo: ', this.sensorsInfo);
    });
};


/***
 *
 * @param {string} id DS18x20 id
 * @param {EspTempSensorsDevice~onTmpResponse} callback
 */
EspTempSensorsDevice.prototype.getSensorTemp = function (id, callback) {
    this.send(this.AVR_COMMANDS.getTemp + ':' + id, function (err, msg) {
        if (err) return callback(err, null);
        callback(err, parseInt(msg) / 10);

    });
};

/***
 * @param {EspTempSensorsDevice~onTmpResponse} callback
 */
EspTempSensorsDevice.prototype.getAllSensorTemp = function (callback) {
    var r = {};
    var c = 0;

    var sensors = myUtils.cloneArray(this.sensorsInfo.sensors);
    if (sensors.length == 0 ) return callback('No sensors found', r);

    sensors.forEach(function (e) {
        this.getSensorTemp(e, function (err, tmp) {
            if (err) r[e] = null;
            else r[e] = tmp;
            c++;

            if (c == sensors.length) callback(null, r);
        });
    }, this);
};

/**
 */
EspTempSensorsDevice.prototype.initEspTempSensorsDevice = function () {
    this.getSensorsId();

};


module.exports = EspTempSensorsDevice;
//t1: 291, t2: 290, t3: 291


/***
 * @callback EspTempSensorsDevice~onTmpResponse
 * @param err
 * @param {number} tmp
 */


/***
 * @callback EspTempSensorsDevice~onTmpResponse
 * @param err
 * @param tmps
 */