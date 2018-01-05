// INTERFACES
import { Domusto } from '../domusto/DomustoInterfaces';

/**
 * Device class for a DOMUSTO device
 *
 * @author Bas van Dijk
 * @class DomustoDevice
 */
class DomustoDevice {

    protected _id: string;
    protected _screens: Array<string>;
    protected _enabled: boolean;
    protected _name: string;
    protected _type: Domusto.DeviceType;
    protected _subType: Domusto.DeviceSubType;
    protected _role: Domusto.DeviceRole;
    protected _plugin: Domusto.DevicePlugin;
    protected _data: any;
    protected _lastUpdated = new Date();

    constructor(device) {
        this._id = device.id;
        this._screens = device.screens || ['main'];
        this._enabled = device.enabled;
        this._name = device.name;
        this._type = device.type;
        this._subType = device.subType;
        this._role = device.role;
        this._plugin = device.plugin;
        this._data = device.data || null;
    }


    /**
     * Converts the DOMUSTO device to JSON
     *
     * @returns The device as JSON object
     * @memberof DomustoDevice
     */
    toJSON() {
        return {
            id: this._id,
            screens: this._screens,
            enabled: this._enabled,
            name: this._name,
            type: this._type,
            subType: this._subType,
            role: this._role,
            plugin: this._plugin,
            data: this._data,
        };
    }

    get id(): string {
        return this._id;
    }
    set id(id: string) {
        this._id = id;
    }

    get screens(): Array<string> {
        return this._screens;
    }
    set screens(screens: Array<string>) {
        this._screens = screens;
    }

    get enabled(): boolean {
        return this._enabled;
    }
    set enabled(enabled: boolean) {
        this._enabled = enabled;
    }

    get name(): string {
        return this._name;
    }
    set name(name: string) {
        this._name = name;
    }

    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }

    get subType() {
        return this._subType;
    }
    set subType(subType) {
        this._subType = subType;
    }

    get role(): Domusto.DeviceRole {
        return this._role;
    }
    set role(role: Domusto.DeviceRole) {
        this._role = role;
    }

    get plugin(): Domusto.DevicePlugin {
        return this._plugin;
    }
    set plugin(plugin: Domusto.DevicePlugin) {
        this._plugin = plugin;
    }

    get lastUpdated(): Date {
        return this._lastUpdated;
    }
    set lastUpdated(lastUpdated: Date) {
        this._lastUpdated = lastUpdated;
    }

    get data() {
        return this._data;
    }
    set data(data: any) {
        this._data = data;
    }

}

export default DomustoDevice;