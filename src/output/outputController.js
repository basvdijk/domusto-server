'use strict';

let domustoDevicesManager = require('../domusto/domustoDevicesManager');

exports.list = function (req, res) {   
    res.json(Domusto.getDevicesByRole('output'));
};

exports.command = function(req, res) {
    domustoDevicesManager.outputCommand(req.params.deviceId, req.params.state, result => {
        res.json(result);
    });
}