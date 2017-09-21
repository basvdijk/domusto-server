import { InputData } from './InputData';

export interface InputDataHumidity extends InputData {
    data: {
        deviceTypeString: string;
        batteryLevel?: number;
        rssi?: number;
        humidity: number;
        humidityStatus?: number;
    };
}