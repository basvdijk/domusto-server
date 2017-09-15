'use strict';

let domusto = require('../domusto');

exports.on = function (req, res) {
    domusto.outputCommand(req.params.deviceId, function() {
        res.json({
            state: 'on'
        });
    });
};

exports.off = function (req, res) {
    domusto.outputCommand(req.params.deviceId, function() {
        res.json({
            state: 'on'
        });
    });
};