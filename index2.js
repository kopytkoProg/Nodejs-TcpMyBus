var MyConsole = require("./my_console");
MyConsole.setAllowedModuleList(
    ['KeepAlive', 'TcpMyBus', 'AutoReconnect-', 'Test', 'PackerReassembler', 'EspDevice'],
    ['KeepAlive', 'TcpMyBus', 'AutoReconnect-', 'Test', 'PackerReassembler', 'EspDevice']
);


var my_tcp_bus = require("./my_tcp_bus/my_tcp_bus");
var KeepAlive = require("./keep_alive");
var esp_device = require("./esp_device/esp_device");

var con = MyConsole.get('Test');

// --- var ---
var msg = 'Hi, I am the long msg spaced with 000000000 and the end';

var err = 0;
var succ = 0;
var sent = 0;


//var bus = new my_tcp_bus('192.168.1.170', 300);
//new KeepAlive(bus);

var bus = new esp_device({ip: '192.168.1.170', port: 300});

msg = bus.SPECIAL_COMMANDS.scanNetwork;

bus.send(bus.SPECIAL_COMMANDS.getMacInfo, function(err, m){
    con.log(m);

    bus.send(msg, onReceive);
});


var onReceive = function (err, d) {

    if (err) {
        con.log('Received Error: ' + err);
    } else {
        con.log('Received: ' + d.toString());
    }



};
//onReceive(null, '');









