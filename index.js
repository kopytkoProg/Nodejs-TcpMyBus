var net = require('net');
var sleep = require('sleep');
var Jetty = require("jetty");


// --- var ---
var msg = '{Hi, I am the msg}';
var err = 0;
var succ = 0;
var sent = 0;
var jetty = new Jetty(process.stdout);
// -----------
jetty.clear();

var c = {
    log: function (txt, l) {
        jetty.moveTo([l, 0]);
        jetty.clearLine(l);
        jetty.text(txt);
    }
};

var printStat = function () {
    c.log("sent: " + sent, 4);
    c.log("succ: " + succ, 5);
    c.log("err:  " + err, 6);

};


var client = net.connect({port: 300, host: '192.168.1.170'},
    function () { //'connect' listener
        c.log('connected to server!', 1);

        var f = function () {


            client.write(msg);
            //console.log("I -> " + msg);
            sent++;
            setTimeout(f, 200);
        };
        f();

    });

client.setKeepAlive(true, 100);


client.on('data', function (data) {

    if (data.toString() == msg) {
        succ++;
    } else {
        err++;

        c.log("\r\b" + "I <- " + data.toString(), 10 + err);
    }
    printStat();
    c.log("\r\b" + "I <- " + data.toString(), 2);


});


client.on('end', function () {
    console.log('disconnected from server');
});



