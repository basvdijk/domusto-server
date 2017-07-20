let Util = {};

Util.debug = function() { 
    Array.prototype.unshift.call(arguments, '[domusto] ');
    console.log.apply(this, arguments)
}

Util.log = function() {
    Array.prototype.unshift.call(arguments, '[domusto] ');
    console.log.apply(this, arguments)
}

module.exports = Util;