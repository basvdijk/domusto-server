'use strict';

module.exports = function (app) {

    var output = require('./outputController');

    app.route('/output')
        .get(output.list)

};