/**
 * Created by michal on 24.06.15.
 */

var o = {};
var A = function () {

};

A.prototype = o;



var o1 = new A();
var o2 = new A();

o.p = 'zz';
o2.p = 'asdzz';



console.log(o2);