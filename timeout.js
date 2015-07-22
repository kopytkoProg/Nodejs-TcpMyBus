/**
 * Created by michal on 14.06.15.
 */



/**
 *
 * @param {function} f
 * @constructor
 */
var Timeout = function (f, time) {
    var id = null;
    var t = this;

    var timeout = function () {
        f();
    };

    this.arm = function () {
        t.disarm();
        id = setTimeout(timeout, time)
    };

    this.disarm = function () {
        if (id != null) clearTimeout(id);

    };
};

module.exports = Timeout;