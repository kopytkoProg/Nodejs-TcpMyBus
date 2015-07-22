/**
 * Created by michal on 22.07.15.
 */

var ILogicalTempSensorInterface = require('./Interfaces/logical_temp_sensor_interface');
var util = require('util');
var SimpleLogicalDevice = require('./simple_logical_device');
/**
 *
 * @param {SimpleLogicalDevice} esp
 * @param id
 * @constructor
 */

var LogicalTempSensor = function (esp, id) {
    /** @type {SimpleLogicalDevice~cfg} */
    var cfg = {
        description: "Temp sensor somewhere", // TODO: connect with rpiserv sensors descriptions
        name: "Some name",
        espDev: esp
    };
    // call supper
    LogicalTempSensor.super_.call(this, cfg);

    this.id = id;
    this.esp = esp;

    ILogicalTempSensorInterface.ensureImplements(this);
};
util.inherits(LogicalTempSensor, SimpleLogicalDevice);

LogicalTempSensor.prototype.getId = function () {
    return this.id;
};


/**
 *
 * @param {EspTempSensorsDevice~onTmpResponse} callback
 */
LogicalTempSensor.prototype.getTemp = function (callback) {
    return this.esp.getSensorTemp(this.id, callback);
};

module.exports = LogicalTempSensor;