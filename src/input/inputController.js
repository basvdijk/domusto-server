'use strict';

let DomustoRfxCom = require('../plugins/domusto-rfxcom');
let Domusto = require('../domusto');

exports.list = function (req, res) {   
    res.json(Domusto.inputDevices);
};