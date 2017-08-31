/**
 * Author:       Bas van Dijk
 * Description:  DOMUSTO timer module handles the sun, time and event timers
 */

let SunCalc = require('suncalc');
let schedule = require('node-schedule');
let util = require('../util');
let config = require('../config');
let DomustoEmitter = require('./DomustoEmitter');

class DomustoTimer {

    constructor(device, timer, callback) {

        var _device = device;
        var _timer = timer;

        this.callback = callback;

        if (timer.enabled) {

            _device.hasTimers = true;

            switch (timer.type) {

                case 'time':
                    util.log('Timer (time) set for', _device.id, 'state', timer.state, 'at', timer.time);

                    schedule.scheduleJob(timer.time, function () {
                        util.log('Timer (time) activated for', _device.id, 'state', timer.state);
                        util.logTimersToFile('Timer (time) activated for ' + _device.id + ' state: ' + timer.state);
                        this.callback(_device.id, _timer.state);
                    });
                    break;

                case 'sun':
                    this._scheduleSunTimer(_device, timer);
                    break;

                case 'event':
                    this._initEventTimer(_device, timer);
                    break;

            }

        } else {
            util.log('Timer disabled for', timer.time, 'state', timer.state, '-> Set enabled to true to enable');
        }

    };

    /**
     * Schedules a timer according to sunset, sunrise etc
     * @param {object} device The device who executes the command
     * @param {object} timer The timer object which contains the timer information
     */
    _scheduleSunTimer(device, timer) {

        var _device = device;
        var _timer = timer;

        let times = SunCalc.getTimes(new Date(), config.location.latitude, config.location.longitude);
        let date = util.offsetDate(times[_timer.condition], _timer.offset);

        // If the next event is tomorrow
        if (date < new Date()) {
            let today = new Date();
            let tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
            times = SunCalc.getTimes(tomorrow, config.location.latitude, config.location.longitude);
            date = util.offsetDate(times[_timer.condition], _timer.offset);
        }

        util.log('Timer (sun) set for', _device.id, 'state', _timer.state, 'at', date, '/', new Date(date).toLocaleString());

        schedule.scheduleJob(date, () => {
            util.log('Timer (sun) activated for', _device.id, 'state', _timer.state);
            util.logTimersToFile('Timer (sun) activated for ' + _device.id + ' state: ' + timer.state);
            this.callback(_device.id, _timer.state);

            // Reschedule for next day
            this._scheduleSunTimer(_device, _timer);
        });

    }

    /**
     * Schedules a timer according to sunset, sunrise etc
     * @param {object} device The device who executes the command
     * @param {object} timer The timer object which contains the timer information
     */
    _initEventTimer(device, timer) {

        var _device = device;
        var _timer = timer;

        DomustoEmitter.on(device.id + _timer.event, () => {

            let date = util.offsetDate(new Date(), _timer.offset);

            schedule.scheduleJob(date, () => {
                util.log('Timer (event) activated for', _device.id, 'state', _timer.state);
                util.logTimersToFile('Timer (event) activated for ' + _device.id + ' state: ' + _timer.state);
                this.callback(_device.id, _timer.state);
            });

        });

    }

}

module.exports = DomustoTimer;