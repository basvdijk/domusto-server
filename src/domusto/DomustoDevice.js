
/**
 * Model class for a DOMUSTO device
 * 
 * @author Bas van Dijk 
 * @class DomustoDevice
 */
class DomustoDevice {

    constructor(device) {
        this._id = device.id;
        this._enabled = device.enabled;
        this._name = device.name;
        this._type = device.type;
        this._subType = device.subType;
        this._role = device.role;
        this._protocol = device.protocol;
        this._data = device.data;
        this._lastUpdated = new Date();
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
        }
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

module.exports = DomustoDevice;