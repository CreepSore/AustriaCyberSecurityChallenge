"use strict";

class IRiddleHandler {
    constructor(handlerId, handlerName, storage) {
        this.handlerId = handlerId;
        this.handlerName = handlerName;
        this.storage = storage;
    }

    /**
     * @returns true = solved; false = unsolved
     */
    solve() { return false; }

    log(message) {
        console.log(`[${this.handlerName}][${this.handlerId}] ${message}`);
    }
}

module.exports = IRiddleHandler;
