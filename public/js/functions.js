'use strict'

Number.prototype.sigFig = function(precision){
    if( !precision ) precision = 2;
    var d = Math.pow(10, precision);
    return ( parseInt( this.valueOf() * d) / d ).toFixed(precision);
};


