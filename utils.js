/**
 * Created by michal on 21.07.15.
 */

var Utils = {
    countNumberOfFields: function(obj){
        var c = 0, p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                c += 1;
            }
        }

        return c;
    },

    cloneArray: function(arr){
        return arr.slice(0);
    }

    
};



module.exports = Utils;