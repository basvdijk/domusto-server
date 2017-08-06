'use strict';

let DomustoRfxCom = require('../plugins/domusto-rfxcom');
let Domusto = require('../domusto');

exports.list = function (req, res) {   
    res.json(Domusto.getDevicesByRole('output'));
};

exports.command = function(req, res) {

    Domusto.outputCommand(req.params.deviceId, req.params.state, result => {
        res.json(result);
    });
}