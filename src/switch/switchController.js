'use strict';

let domusto = require('../domusto.js');

exports.on = function (req, res) {
    res.json({
        state: 'on'
    });
    domusto.switchOn(req.params.deviceId);
};

exports.off = function (req, res) {
    res.json({
        state: 'off'
    });
    domusto.switchOff(req.params.deviceId);
};