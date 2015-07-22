/**
 * Created by michal on 12.06.15.
 */

var cons = require("./my_console").get('PackerReassembler');
/**
 *
 * @param {PackerReassembler~onMsg} f
 * @constructor
 */

var PackerReassembler = function (f) {
    this.callback = f;
    this.buffer = '';
};


/**
 *
 * @param {string} msg
 */
PackerReassembler.prototype.adMsg = function (msg) {

    if (this.buffer.length == 0) {
        var begin = msg.indexOf('{');

        if(begin > 0) cons.error('Invalid begin  received', msg);

        if (begin >= 0) {
            msg = msg.substr(begin, msg.length - begin);
            this.buffer += msg;
        }

    } else {
        this.buffer += msg;
    }

    var end = this.buffer.indexOf('}');

    if (end >= 0) {
        var reassembledMsg = this.buffer.substr(0, end + 1);
        this.callback(null, reassembledMsg);

        var restOfMsg = this.buffer.substr(end + 1, end + this.buffer.length);
        //console.log(reassembledMsg + "|" + restOfMsg)

        this.buffer = '';

        if (restOfMsg.length > 0) this.adMsg(restOfMsg);

    }
};

module.exports = PackerReassembler;


/**
 * Called when msg reassembled
 * @callback PackerReassembler~onMsg
 * @param  err
 * @param {string} msg
 */
