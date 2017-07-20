'use strict';

let domusto = require('../domusto.js');

exports.on = function (req, res) {
    domusto.switchOn(req.params.deviceId, function() {
        res.json({
            state: 'on'
        });
    });
};

exports.off = function (req, res) {
    domusto.switchOff(req.params.deviceId, function() {
        res.json({
            state: 'on'
        });
    });
};