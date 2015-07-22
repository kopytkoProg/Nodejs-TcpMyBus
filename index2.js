var MyConsole = require("./my_console");
MyConsole.setAllowedModuleList(
    [
        'KeepAlive-',
        'TcpMyBus',
        'AutoReconnect',
        'Test',
        'PackerReassembler',
        'EspDevice',
        'SpecialMsgHandler',
        'EspTempSensorDeviceDevice'
    ],
    [
        'KeepAlive',
        'TcpMyBus',
        'AutoReconnect',
        'Test',
        'PackerReassembler',
        'EspDevice',
        'SpecialMsgHandler',
        'EspTempSensorDeviceDevice'
    ]
);


var my_tcp_bus = require("./my_tcp_bus/my_tcp_bus");
var KeepAlive = require("./keep_alive");
var esp_temp_sensors_device = require("./esp_device/esp_temp_sensors_device");

var con = MyConsole.get('Test');
var ld = require('./logical_devices/logical_devices');


// --- var ---
var msg = 'Hi, I am the long msg spaced with 000000000 and the endHi, I am the long msg spaced with 000000000 and the endHi, I am the long msg spaced with 000000000 and the endHi, I am the long msg spaced with 000000000 and the end';

var err = 0;
var succ = 0;
var sent = 0;


//var bus = new my_tcp_bus('192.168.1.170', 300);
//new KeepAlive(bus);

var bus = new esp_temp_sensors_device({ip: '192.168.1.170', port: 300});
bus.initEspTempSensorsDevice();

//bus.send(bus.SPECIAL_COMMANDS.scanNetwork);
bus.send(bus.AVR_COMMANDS.helloAvr, function (err, m) {
    con.log('Response form avr: ' + m);
});


setTimeout(function () {
    ld.logicalTempSensors.forEach(function (e) {
        e.getTemp(function (err, temp) {
            if (err) return con.log(err);
            con.log(e.getId() + ' ' + temp);
        });
    });

}, 1000);


//var onReceive = function (err, m) {
//    con.log('TMP: \r\n', m);
//
//    setTimeout(function () {
//
//        bus.getAllSensorTemp(onReceive);
//    }, 1000);
//
//
//};
//onReceive(null, '');


////bus.send(bus.SPECIAL_COMMANDS.getMacInfo, function(err, m){
////    con.log(m);
////});
//
//
//var onReceive = function (err, d) {
//
//    if (err) {
//        con.log('Received Error: ' + err);
//    } else {
//        con.log('Received: ' + d.toString());
//    }
//
//    bus.send(msg, onReceive);
//
//};
//
//onReceive(null, '');









