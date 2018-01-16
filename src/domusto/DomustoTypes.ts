export namespace Domusto {

    export interface PluginConfiguration {
        id: string;
        enabled: boolean;
        dummyData?: boolean;
        debug?: boolean;
        settings?: any;
    }

    export interface PluginConfigurationFieldValidator {
        attribute: string;
        type: string|Object;
        validValues?: Array<any>;
    }

    export enum PluginCategories {
        temperature,
        heating,
        radio,
        utility,
        system,
        push,
        audio
    }

    export interface PluginMetaData {
        plugin: string;
        author: string;
        category: PluginCategories;
        version: string;
        website: string;
    }

    export interface DeviceConfiguration {
        id: string;
        enabled: boolean;
        role: DeviceRole;
        name: string;
        type: DeviceType;
        subType: DeviceSubType;
        plugin: DevicePlugin;
        triggers: DeviceTrigger[];
    }

    export enum DeviceEvent {
        'on',
        'off',
        'trigger',
    }

    export interface DevicePlugin {
        id: string;
        deviceId: string;
        subType: string;
        outputId: string;
        inputIds: string[];
    }

    export enum DeviceRole {
        'input',
        'output'
    }

    export interface DeviceTrigger {
        listenToEvent: {
            deviceId: string;
            events: DeviceEvent[];
        };
        execute: {
            event: DeviceEvent
        };
    }

    export enum DeviceType {
        'switch',
        'temperature',
        'power'
    }

    export enum DeviceSubType {
        'temperature',
        'temperature-humidity',
        'on/off',
        'up/down',
        'momentary'
    }

    export enum EventType {
        'input',
        'output',
        'error',
        'timer',
    }

    export interface InputData {
        pluginId: string;
        deviceId: string;
    }

    export interface InputDataHumidity extends InputData {
        data: {
            deviceTypeString: string;
            batteryLevel?: number;
            rssi?: number;
            humidity: number;
            humidityStatus?: number;
        };
    }

    export interface InputDataTemperature extends InputData {
        data: {
            deviceTypeString: string;
            batteryLevel?: number;
            rssi?: number;
            temperature: number;
        };
    }

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

    export interface Trigger {
        pluginId: string;
        listenToEvents: Array<DeviceEvent>;
        deviceId?: string;
        data?: any;
    }

    export interface Signal {
        sender: SignalSender;
        pluginId: string;
        deviceId?: string;
        data: Object;
    }

    export enum SignalSender {
        'client',
        'plugin'
    }

    export interface SignalTemperature {
        deviceTypeString: string;
        batteryLevel?: number;
        rssi?: number;
        temperature: number;
    }

    export interface InputDataHumidity extends InputData {
        deviceTypeString: string;
        batteryLevel?: number;
        rssi?: number;
        humidity: number;
        humidityStatus?: humidityStatus;
    }

    export enum humidityStatus {
        dry,
        comfort,
        normal,
        wet
    }

}