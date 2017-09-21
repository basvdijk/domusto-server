let SunCalc = require('suncalc');
let schedule = require('node-schedule');
let util = require('../util');
let config = require('../config');
let DomustoEmitter = require('./DomustoEmitter');

/**
 * DOMUSTO timer module handles the sun, time and event tim
 * 
 * @author Bas van Dijk 
 * @class DomustoTimer
 */
class DomustoTimer {

    /**
     * Creates an instance of DomustoTimer.
     * @param {any} device 
     * @param {any} timer 
     * @param {any} callback Callback to execute when timer fires
     * @memberof DomustoTimer
     */
    constructor(device, timer, callback) {

        var _device = device;
        var _timer = timer;

        this.callback = callback;

        if (timer.enabled) {

            _device.hasTimers = true;

            switch (timer.type) {

                case 'time':
                    util.log('    Timer (time)  enabled  for', _device.id, 'state', timer.state, 'at', timer.time);

                    let job = schedule.scheduleJob(timer.time, () => {
                        util.log('     Timer (time)  activated for', _device.id, 'state', timer.state);
                        util.logTimersToFile('Timer (time) activated for ' + _device.id + ' state: ' + timer.state);
                        this.callback(_device.id, _timer.state);
                    });

                    // if (job) {
                    //     console.log(timer.time, job.nextInvocation());
                    // }

                    // console.log(' ');

                    break;

                case 'sun':
                    this._scheduleSunTimer(_device, timer);
                    break;

                case 'event':
                    this._initEventTimer(_device, timer);
                    break;

            }

        } else {

            if (timer.type == 'time') {
                util.warning('    Timer (time)  disabled for', _device.id, 'state', timer.state);
            } else if (timer.type == 'sun') {
                util.warning('    Timer (sun)   disabled for', _device.id, 'state', timer.state);
            } else if (timer.type == 'event') {
                util.warning('    Timer (event) disabled for', _device.id, 'state', timer.state);
            }


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

        util.log('    Timer (sun)   enabled  for', _device.id, 'state', _timer.state, 'at', date, '/', new Date(date).toLocaleString());

        schedule.scheduleJob(date, () => {
            util.log('     Timer (sun)  activated for', _device.id, 'state', _timer.state);
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
                util.log('   Timer (event) activated for', _device.id, 'state', _timer.state);
                util.logTimersToFile('Timer (event) activated for ' + _device.id + ' state: ' + _timer.state);
                this.callback(_device.id, _timer.state);
            });

        });

    }

}

module.exports = DomustoTimer;