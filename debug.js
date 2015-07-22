/**
 * Created by michal on 13.06.15.
 */

var net = require('net');
var sleep = require('sleep');
var Jetty = require("jetty");
var PR = require("./packer_reassembler");

var DEBUG_MSG = '{debug-esp8266}'


var client = net.connect({port: 300, host: '192.168.1.170'},
    function () { //'connect' listener
        console.log('connected to server!');
        client.write(DEBUG_MSG);

    });

client.setKeepAlive(true, 100);


/**
 *
 * @param {string} msg
 */
var isError = function (msg) {
    return msg.toLocaleLowerCase().indexOf('err') >= 0;
}

client.on('data', function (data) {
    var m = data.toString();

    if (isError(m)) console.error('-> ' + m);
    else console.log('-> ' + m);

});


client.on('end', function () {
    console.log('disconnected from esp');
});


