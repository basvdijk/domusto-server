
/**
 * Model class for a DOMUSTO device
 *
 * @author Bas van Dijk
 * @class DomustoDevice
 */
class DomustoDevice {

    protected _id: string;
    protected _enabled: boolean;
    protected _name: string;
    protected _type: string;
    protected _subType: string;
    protected _role: string;
    protected _protocol: Object;
    protected _data: Object;
    protected _lastUpdated = new Date();

    constructor(device) {
        this._id = device.id;
        this._enabled = device.enabled;
        this._name = device.name;
        this._type = device.type;
        this._subType = device.subType;
        this._role = device.role;
        this._protocol = device.protocol;
        this._data = device.data;
    }

    toJSON() {
        return {
            id: this._id,
            enabled: this._enabled,
            name: this._name,
            type: this._type,
            subType: this._subType,
            role: this._role,
            protocol: this._protocol,
            data: this._data,
        };
    }

    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }

    get enabled() {
        return this._enabled;
    }
    set enabled(enabled) {
        this._enabled = enabled;
    }

    get name() {
        return this._name;
    }
    set name(name) {
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

    get role() {
        return this._role;
    }
    set role(role) {
        this._role = role;
    }

    get protocol() {
        return this._protocol;
    }
    set protocol(protocol) {
        this._protocol = protocol;
    }

    get lastUpdated() {
        return this._lastUpdated;
    }
    set lastUpdated(lastUpdated) {
        this._lastUpdated = lastUpdated;
    }

    get data() {
        return this._data;
    }

}

export default DomustoDevice;