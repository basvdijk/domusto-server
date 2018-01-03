export namespace Domusto {

    export interface PluginConfiguration {
        enabled: boolean;
        dummyData: boolean;
        debug: boolean;
        type: string;
        settings: any;
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
        protocol: DeviceProtocol;
        triggers: DeviceTrigger[];
    }

    export enum DeviceEvent {
        'on',
        'off',
        'trigger',
    }

    export interface DeviceProtocol {
        pluginId: string;
        deviceId: string;
        type: string;
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

    export interface DomustoPlugin {

        toString(): string;
        addRegisteredDevice(any);
        trigger(string, any);
        onNewInputData();
        pluginConfiguration: PluginConfiguration;
        metaData;
        hardwareInstance;
        registeredDevices;

    }

}