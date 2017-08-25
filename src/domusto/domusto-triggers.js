/**
 * Author:       Bas van Dijk
 * Description:  DOMUSTO trigger module
 */

let util = require('../util');
let config = require('../config');
let domustoEmitter = require('./domusto-emitter');

DomustoTriggers = {};

DomustoTriggers.initPluginTriggers = function (domustoPluginInstance, pluginConfiguration) {

    pluginConfiguration.triggers.forEach(trigger => {

        trigger.listenToEvent.events.forEach(triggerEvent => {

            let listen = trigger.listenToEvent;

            domustoEmitter.on(trigger.listenToEvent.deviceId + triggerEvent, () => {
                domustoPluginInstance.trigger(trigger.execute.event, trigger.execute.parameters);
            });

        });

    });

}

DomustoTriggers.initDeviceTriggers = function (devices, outputCommand) {

    for (let i in devices) {

        let device = devices[i];

        if (device.triggers) {

            device.triggers.forEach(trigger => {

                trigger.listenToEvent.events.forEach(triggerEvent => {

                    let listen = trigger.listenToEvent;

                    domustoEmitter.on(trigger.listenToEvent.deviceId + triggerEvent, () => {
                        outputCommand(device.id, trigger.execute.event);
                    });

                });

            });

        }

    };

}

module.exports = DomustoTriggers;