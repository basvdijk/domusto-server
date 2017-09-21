import { DeviceTrigger } from './DeviceTrigger';
import { DeviceProtocol } from './DeviceProtocol';
import { DeviceSubType, DeviceType } from './DeviceType';
import { DeviceRole } from './DeviceRole';

export interface DeviceConfiguration {
    id: string;
    enabled: boolean;
    role: DeviceRole;
    name: string;
    type: DeviceType;
    subType: DeviceSubType;
    protocol: DeviceProtocol;
    triggers: DeviceTrigger[];
}