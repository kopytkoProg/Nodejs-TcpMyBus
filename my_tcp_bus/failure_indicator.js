/**
 * Created by michal on 14.07.15.
 */


/**
 *
 * @param waitTime time to wait after failure. After this time state is ok
 * @constructor
 */
var FailureIndicator = function (waitTime) {
    this.lastFail = 0;
    this.waitTime = waitTime;
};


FailureIndicator.prototype.fail = function () {
    this.lastFail = new Date().getTime();
};

FailureIndicator.prototype.isOk = function () {
    return this.lastFail + this.waitTime < new Date().getTime();
};

FailureIndicator.prototype.isFail= function () {
    return !this.isOk();
};

module.exports = FailureIndicator;