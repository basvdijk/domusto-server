'use strict';

let DomustoRfxCom = require('../plugins/domusto-rfxcom');

exports.list = function (req, res) {   
    res.json(DomustoRfxCom.outputDevices);
};