'use strict';

let domusto = require('../domusto.js');

exports.on = function (req, res) {
    res.json('on');   
    domusto.switchOn(req.params.deviceId);
};

exports.off = function (req, res) {
    // console.log(req);
    res.json('off');
    domusto.switchOff(req.params.deviceId);
};