let DomustoDevice = require('./DomustoDevice');
let config = require('../config');

class DomustoOutput extends DomustoDevice {

    /**
     * Initialises an output device with its default DOMUSTO device properties
     * @param {object} output Output device object from configuration
     */
    constructor(output) {

        super(output);

        this._state = 'off';
        this._busy = false;
        this._hasTimers = false;
        this._timers = output.timers || null;

        let serverAddress = 'http://' + config.server.ip + ':' + config.server.port + '/'

        switch (output.subType) {

            case 'on/off':
            case 'up/down':

                this._actions = {
                    on: serverAddress + 'output/command/' + this._id + '/on',
                    off: serverAddress + 'output/command/' + this._id + '/off'
                }
                break;

            case 'momentary':

                this._actions = {
                    trigger: serverAddress + 'output/command/' + this._id + '/trigger'
                }
                break;
        }

    }


    toJSON() {

        // Merge partent with output attributes
        return Object.assign(super.toJSON(), {
            state: this._state,
            busy: this._busy,
            hasTimers: this._hasTimers,
            timers: this._timers,
            actions: this._actions,
        });

    }

    get timers() {
        return this._timers;
    }
    set timers(timers) {
        this._timers = timers;
    }

    get hasTimers() {
        return this._hasTimers;
    }
    set hasTimers(hasTimers) {
        this._hasTimers = hasTimers;
    }

    get busy() {
        return this._busy;
    }
    set busy(busy) {
        this._busy = busy;
    }

    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
    }

    get actions() {
        return this._actions;
    }
    set actions(actions) {
        this._actions = actions;
    }

}

module.exports = DomustoOutput;