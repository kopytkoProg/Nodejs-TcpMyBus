/**
 * Created by michal on 14.07.15.
 */
var MAX_ID_NUMBER = 65536;


var Msg = function () {
    this.content = '';
    this.args = [];
};

Msg.prototype = {
    get id() {
        return this.hasHeader() ? this.args[0] : null;
    },
    set id(val) {
        this.args[0] = val;
    },
    hasHeader: function () {
        return this.args.length > 0
    },
    isAsync: function(){
        return !this.hasHeader() || isNaN(this.args[0]);
    }
};

Msg.prototype.toString = function () {
    return '{' + this.args.join() + '|' + this.content + '}'
};

//----------------------------------------------------------------------------------------------------------------------

var MsgFactory = function () {
    this.idGenerator = {
        number: 10,
        next: function () {
            this.number = (this.number + 1) % MAX_ID_NUMBER;
            return this.number;
        }
    };
};

/**
 * parse msg from raw txt
 * @param {string} txt
 * @returns {Msg}
 */
MsgFactory.prototype.parse = function (txt) {

    var m;
    var msg = new Msg();

    if (m = new RegExp('^{(.*)[|](.*)}$').exec(txt)) {  // eg: {id,other params,...|contentOfMsg}
        msg.args = m[1].split(',');
        msg.content = m[2];
    } else if (m = new RegExp('^{(.*)}$').exec(txt)) {  // eg: {contentOfMsg}
        msg.content = m[1];
        msg.args = [];
    }


    return msg;
};
/**
 *
 * @param content
 * @returns {Msg}
 */
MsgFactory.prototype.create = function (content) {

    if (new RegExp('{|}|[|]').test(content))
        throw 'Illegal character in content!';


    var msg = new Msg();
    msg.args = [this.idGenerator.next()]; // sett id and other args
    msg.content = content;

    return msg;

};

module.exports = MsgFactory;