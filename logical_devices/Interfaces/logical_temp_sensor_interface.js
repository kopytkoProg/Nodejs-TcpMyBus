/**
 * Created by michal on 22.07.15.
 */
var DuckTypingInterface = require('./../../duck_typing_interface');



var ILogicalTempSensorInterface = new DuckTypingInterface('ILogicalTempSensorInterface',
    [
        'getId',
        'getTemp'
    ]
);


module.exports = ILogicalTempSensorInterface;