/**
 * Created by michal on 14.06.15.
 */


var SIZE_OF_NAME_COLUMN = 30;


var allowedLog = [];
var allowedError = [];

String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
};

var MyConsole = {

    get: function (name) {
        var log = allowedLog.indexOf(name) >= 0;
        var error = allowedError.indexOf(name) >= 0;

        name = name + ':' + ' '.repeat(SIZE_OF_NAME_COLUMN - name.length);


        return {
            name: name,
            /**
             @param {...*} message
             */
            log: (log ?
                function () {
                    var a = Array.prototype.slice.call(arguments);
                    a.unshift(this.name);
                    console.log.apply(console, a);
                } :
                function () {

                }),
            /**
             @param {...*} message
             */
            error: (error ?
                function () {
                    var a = Array.prototype.slice.call(arguments);
                    a.unshift(this.name);
                    console.error.apply(console, a);
                } :
                function () {

                })
        };


    },

    /**
     *  Set the permission list for modules.
     *
     * @param {string[]} al modules allowed to use log
     * @param {string[]} ae modules allowed to use error
     */
    setAllowedModuleList: function (al, ae) {
        allowedLog = al;
        allowedError = ae;
    }


};


module.exports = MyConsole;