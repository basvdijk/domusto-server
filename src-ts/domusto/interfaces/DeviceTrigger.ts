import { DeviceEvent } from './DeviceEvent';

export interface DeviceTrigger {
    listenToEvent: {
        deviceId: string;
        events: DeviceEvent[];
    };
    execute: {
        event: DeviceEvent
    };
}