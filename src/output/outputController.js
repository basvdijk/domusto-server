'use strict';

let DomustoDevicesManager = require('../domusto/DomustoDevicesManager');

exports.list = function (req, res) {   
    res.json(Domusto.getDevicesByRole('output'));
};

exports.command = function(req, res) {
    DomustoDevicesManager.outputCommand(req.params.deviceId, req.params.state, result => {
        res.json(result);
    });
}