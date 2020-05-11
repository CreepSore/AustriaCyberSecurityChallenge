"use strict";

class KeyStorage {
    constructor(name) {
        if(!name) {
            throw new Error("[KeyStorage] Tried to create KeyStorage without name");
        }

        this.name = name;
        this._entries = {};
    }

    getObject(key, defaultObj) {
        let o = this._entries[key];
        if(!o) {
            if(defaultObj !== undefined) {
                return defaultObj;
            }
            throw new Error(`[KeyStorage] Unknown Object with key '${key}' requested in ${this.name}`);
        }
        return o;
    }

    registerObject(key, obj, overwrite = false) {
        if(this._entries[key] && !overwrite) {
            throw new Error(`Object with key '${key}' already exists in ${this.name}`);
        }
        this._entries[key] = obj;
        return this._entries[key];
    }

    get(key, defaultObj) {
        return this.getObject(key, defaultObj);
    }

    register(key, object) {
        return this.registerObject(key, object);
    }
}

module.exports = KeyStorage;
