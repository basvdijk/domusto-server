'use strict';

module.exports = function (app) {

    var output = require('./outputController');

    app.route('/output')
        .get(output.list);

    app.route('/output/command/:deviceId/:state')
        .get(output.command)

};