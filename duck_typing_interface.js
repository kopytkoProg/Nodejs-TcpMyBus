/**
 * Created by michal on 25.06.15.
 */

/**
 *
 * @param name
 * @param methods
 * @constructor
 */
var DuckTypingInterface = function (name, methods) {

    if (arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
    }

    this.name = name;
    this.methods = [];

    for (var i = 0, len = methods.length; i < len; i++) {
        if (typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be passed in as a string.");
        }

        this.methods.push(methods[i]);
    }
};

DuckTypingInterface.prototype.ensureImplements = function (object) {

    DuckTypingInterface.ensureImplements.apply(DuckTypingInterface, [object, this]);

};

// Static class method.
DuckTypingInterface.ensureImplements = function (object) {
    if (arguments.length < 2) {
        throw new Error("Function DuckTypingInterface.ensureImplements called with " + arguments.length + "arguments, but expected at least 2.");
    }

    for (var i = 1, len = arguments.length; i < len; i++) {
        var dti = arguments[i];

        if (dti.constructor !== DuckTypingInterface) {
            throw new Error("Function DuckTypingInterface.ensureImplements expects arguments two and above to be instances of DuckTypingInterface.");
        }

        for (var j = 0, methodsLen = dti.methods.length; j < methodsLen; j++) {
            var method = dti.methods[j];

            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function DuckTypingInterface.ensureImplements: object does not implement the " + dti.name + " interface. Method " + method + " was not found.");
            }
        }
    }
};


module.exports = DuckTypingInterface;