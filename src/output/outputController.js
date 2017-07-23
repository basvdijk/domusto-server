'use strict';

let DomustoRfxCom = require('../plugins/domusto-rfxcom');
let Domusto = require('../domusto');

exports.list = function (req, res) {   
    res.json(DomustoRfxCom.outputDevices);
};

exports.list = function (req, res) {   
    res.json(Domusto.outputDevices);
};

exports.command = function(req, res) {

    Domusto.outputCommand(req.params.deviceId, req.params.state, function success(result) {
        res.json(result);
    });

}

exports.off = function(deviceId) {
    Domusto.switchOff(deviceId, function success(result) {
        res.json(result);
    });
}