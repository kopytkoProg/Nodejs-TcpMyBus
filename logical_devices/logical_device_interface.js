/**
 * Created by michal on 25.06.15.
 */
var DuckTypingInterface = require('./../duck_typing_interface');



var ILogicalDeviceInterface = new DuckTypingInterface('ILogicalDeviceInterface',
    [
        'getName',
        'getDescription',
        'getEspDev'
    ]
);


module.exports = ILogicalDeviceInterface;