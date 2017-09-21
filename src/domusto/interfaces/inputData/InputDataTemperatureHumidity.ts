import { InputData } from './InputData';

export interface TemperatureHumidity extends InputData {
    data: {
        deviceTypeString: string;
        batteryLevel?: number;
        rssi?: number;
        humidity?: number;
        humidityStatus?: number;
        temperature?: number;
    };
}