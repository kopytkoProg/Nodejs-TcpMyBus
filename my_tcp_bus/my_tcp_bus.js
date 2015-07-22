/**
 * Created by michal on 13.06.15.
 */

var AutoReconnect = require('./../auto_reconnect');
var PackerReassembler = require("./../packer_reassembler");
var Timeout = require("./../timeout");
var cons = require("./../my_console").get('TcpMyBus');
var FailureIndicator = require('./failure_indicator');
var MsgFactory = require('./msg');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var msgFactory = new MsgFactory();


var RESPONSE_TIMEOUT = 7 * 1000; // 5 s
var WAIT_AFTER_FAILURE = 60 * 1000; // 60 s

var STATES = {
    disconnected: {name: 'disconnected'},
    idle: {name: 'idle'},
    waitingForResponse: {name: 'waitingForResponse'}
};


/**
 * @constructor
 */
var Task = function () {
    /**
     * @type {Msg}
     */
    this.msg = null;
    /**
     * @type {number}
     */
    this.numOfTry = 0;
    /**
     * @type {TcpMyBus~onResponse}
     */
    this.callback = null;

};


/**********************************************************************************************************************/

// eg: '192.168.1.170', 300,

/**
 *
 * @param host
 * @param port
 * @class
 * @extends EventEmitter
 * @fires *
 */
var TcpMyBus = function (host, port) {
    // call super constructor
    TcpMyBus.super_.call(this);
    var t = this;

    var state = STATES.disconnected;

    var lastActivity = 0;

    var updateLastActivityTime = function () {
        lastActivity = new Date().getTime();
    };

    /**
     * Return time of last connection activity (receive or connection create or recreate).
     * @returns {number}
     */
    this.getLastActivity = function () {
        return lastActivity;
    };

    /**
     * @type {Array.<Task>}
     */
    var queue = [];
    var timeout = new Timeout(function () {
        // try to resend the first packet
        cons.log('timeout');
        state = STATES.idle;
        next();

    }, RESPONSE_TIMEOUT);

    var failureIndicator = new FailureIndicator(WAIT_AFTER_FAILURE);

    var next = function () {

        if (state == STATES.idle && queue.length > 0) {


            if (failureIndicator.isFail()) {
                /*
                 if connection failed (in previous step, was no response)
                 */
                var e = queue.shift();
                cons.log('Drop (failure): ' + JSON.stringify(e));
                e.callback.call(t, 'Cant send because of failure', null);
                return next();

            } else if (queue[0].numOfTry >= 5) {
                /*
                 if no response com while fev try
                 */
                var e = queue.shift();
                cons.log('Drop (no response): ' + JSON.stringify(e));
                e.callback.call(t, 'No response', null);
                failureIndicator.fail();
                return next();

            } else {
                /*
                 try to send
                 */
                // cons.log('Try: ' + JSON.stringify(queue[0]));
                state = STATES.waitingForResponse;
                ar.send(queue[0].msg.toString());
                queue[0].numOfTry++;
                timeout.arm();

            }

        }
    };

    var pr = new PackerReassembler(function (err, data) {
        var msg = msgFactory.parse(data);


        if (err) return cons.error('PackerReassemblerError' + err);

        if (!msg.isAsync()) {
            if (queue.length > 0 && state == STATES.waitingForResponse && msg.id == queue[0].msg.id) {
                var e = queue.shift();
                timeout.disarm();
                state = STATES.idle;
                e.callback.call(t, null, msg.content);
                next();

            }
        }
        else {
            if (!t.emit(msg.id, msg))
                cons.log('TODO: exec unheadered msg', msg)
        }
    });

    var ar = new AutoReconnect(host, port,
        /**
         *  called only once
         */
        function () {
            cons.log('Connected to ' + host + ':' + port);
            state = STATES.idle;
            updateLastActivityTime();
            next();
        },
        /**
         *  called on data
         */
        function (data) {
            cons.log('Received from ' + host + ':' + port + ': ' + data.toString());
            updateLastActivityTime();
            pr.adMsg(data.toString());
        },
        /**
         *  called on each disconnect
         */
        function () {
            cons.log('Disconnect from ' + host + ':' + port);
            /*
             When disconnected from server then call next()
             in next method try tu send again but first it have to reconnect so
             reconnect happen.
             After connect the onReconnect callback is called
             */
            state = STATES.idle;
            next();
        },
        /**
         *  called on each reconnect
         */
        function () {
            updateLastActivityTime();
            cons.log('Reconnect to ' + host + ':' + port);

            /*
             Whet it is called its mean that te connection is created so you can try again send msg
             */
            state = STATES.idle;
            next();
        }
    );


    /**
     *
     * @param {string} msg
     * @param {TcpMyBus~onResponse} [callback]
     */
    TcpMyBus.prototype.send = function (msg, callback) {
        var m = new Task();
        m.msg = msgFactory.create(msg);
        if (typeof callback === 'undefined') callback = function () {
        };

        m.callback = callback;


        queue.push(m);
        next();
    };
};
util.inherits(TcpMyBus, EventEmitter);

module.exports = TcpMyBus;


/**
 * @callback TcpMyBus~onResponse
 * @param err
 * @param response
 */