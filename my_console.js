/**
 * Created by michal on 14.06.15.
 */


var SIZE_OF_NAME_COLUMN = 20;


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
            log: (log ?
                function (txt, o) {
                    if (typeof o !== 'undefined') console.log(this.name + ' ' + txt, o);
                    else console.log(this.name + ' ' + txt);
                } :
                function (txt, o) {

                }),
            error: (error ?
                function (txt, o) {
                    if (typeof o !== 'undefined') console.error(this.name + ' ' + txt, o);
                    else console.error(this.name + ' ' + txt);
                } :
                function (txt, o) {

                })
        };


    },

    /***
     *  Set the permission list for modules.
     *
     * @param {[string]} al modules allowed to use log
     * @param {[string]} ae modules allowed to use error
     */
    setAllowedModuleList: function (al, ae) {
        allowedLog = al;
        allowedError = ae;
    }


};


module.exports = MyConsole;