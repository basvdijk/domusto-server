import { InputData } from './InputData';

export interface InputDataTemperature extends InputData {
    data: {
        deviceTypeString: string;
        batteryLevel?: number;
        rssi?: number;
        temperature: number;
    };
}