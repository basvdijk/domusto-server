class DomustoDevice {

    constructor(input) {

        this._id = input.id;
        this._enabled = input.enabled;
        this._name = input.name;
        this._type = input.type;
        this._subType = input.type;
        this._role = input.role;
        this._protocol = input.protocol;
        this._data = input.data;

    }

    toJSON() {
        return {
            id: this._id,
            enabled: this._enabled,
            name: this._name,
            type: this._type,
            subType: this._type,
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
    
    get data() {
        return this._data;
    }

}

module.exports = DomustoDevice;