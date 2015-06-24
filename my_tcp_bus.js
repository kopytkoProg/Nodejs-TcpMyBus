/**
 * Created by michal on 13.06.15.
 */

var AutoReconnect = require('./auto_reconnect');
var PackerReassembler = require("./packer_reassembler");
var Timeout = require("./timeout");
var cons = require("./my_console").get('TcpMyBus');


var RESPONSE_TIMEOUT = 5 * 1000; // 5 s

var STATES = {
    disconnected: {name: 'disconnected'},
    idle: {name: 'idle'},
    waitingForResponse: {name: 'waitingForResponse'}
};


/***
 * @constructor
 */
var Msg = function () {
    /***
     * @type {string}
     */
    this.msg = null;
    /***
     * @type {number}
     */
    this.numOfTry = 0;
    /***
     * @type {TcpMyBus~onResponse}
     */
    this.callback = null;

};


/**********************************************************************************************************************/

// eg: '192.168.1.170', 300,

/***
 *
 * @param host
 * @param port
 * @class
 */
var TcpMyBus = function (host, port) {
    var state = STATES.disconnected;

    var lastActivity = 0;

    var updateLastActivityTime = function () {
        lastActivity = new Date().getTime();
    };

    /***
     * Return time of last connection activity (receive or connection create or recreate).
     * @returns {number}
     */
    this.getLastActivity = function () {
        return lastActivity;
    };

    /***
     * @type {Array.<Msg>}
     */
    var queue = [];
    var timeout = new Timeout(function () {
        // try to resend the first packet
        cons.log('timeout');
        state = STATES.idle;
        next();

    }, RESPONSE_TIMEOUT);

    var next = function () {

        if (state == STATES.idle && queue.length > 0) {

            if (queue[0].numOfTry >= 3) {
                var e = queue.shift();
                cons.log('Drop: ' + JSON.stringify(e));
                e.callback('No response', null);
                return next();
            }
            // cons.log('Try: ' + JSON.stringify(queue[0]));
            state = STATES.waitingForResponse;
            ar.send(queue[0].msg);
            queue[0].numOfTry++;
            timeout.arm();
        }
    };

    var pr = new PackerReassembler(function (err, data) {

        if (err) return cons.error('Error' + err);

        if (queue.length > 0 && state == STATES.waitingForResponse) {
            var e = queue.shift();
            timeout.disarm();
            state = STATES.idle;
            e.callback(null, data);
            next();
        }

    });

    var ar = new AutoReconnect(host, port,
        /***
         *  called only once
         */
        function () {
            cons.log('Connected to ' + host + ':' + port);
            state = STATES.idle;
            updateLastActivityTime();
            next();
        },
        /***
         *  called on data
         */
        function (data) {
            cons.log('Received:' + data.toString());
            updateLastActivityTime();
            pr.adMsg(data.toString());
        },
        /***
         *  called on each reconnect
         */
        function () {
            updateLastActivityTime();
            cons.log('Reconnect to ' + host + ':' + port);
        }
    );


    /***
     *
     * @param {string} msg
     * @param {TcpMyBus~onResponse} callback
     */
    TcpMyBus.prototype.send = function (msg, callback) {
        var m = new Msg();
        m.msg = msg;
        m.callback = callback;

        queue.push(m);
        next();
    };
};

module.exports = TcpMyBus;


/***
 * @callback TcpMyBus~onResponse
 * @param err
 * @param response
 */