"use strict";

class CredentialGenerator {
    /**
     * @memberof CredentialGenerator
     */
    constructor() {
        this._iterator = 0;
        this._creds = [];
    }

    /**
     * @callback populateCallback
     * @param {number} iteration
     */

    /**
     * @param {populateCallback} callback
     * @memberof CredentialGenerator
     */
    populate(callback) {
        for(let i = 0, cont = callback(i); cont; i++, cont = callback(i)) {
            if(Array.isArray(cont)) this._creds.push([...cont]);
            else this._creds.push(cont);
        }
    }

    /**
     * @returns {string}
     * @memberof CredentialGenerator
     */
    currentCredential() {
        return this._creds[this._iterator];
    }

    /**
     * @returns {string}
     * @memberof CredentialGenerator
     */
    getNextCredential() {
        this._iterator++;
        return this.currentCredential();
    }
}

module.exports = CredentialGenerator;
