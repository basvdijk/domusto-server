'use strict';

module.exports = function (app) {

    var switches = require('./switchController');

    app.route('/switch/:deviceId/on')
        .get(switches.on)

    app.route('/switch/:deviceId/off')
        .get(switches.off)

};