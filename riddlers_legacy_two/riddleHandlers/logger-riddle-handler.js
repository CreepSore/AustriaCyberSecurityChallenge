"use strict";
const IRiddleHandler = require("./IRiddleHandler");

class LogRiddleHandler extends IRiddleHandler {
    constructor(storage) {
        super(-1, "Logger", storage);
    }

    solve(formatting, data, raw) {
        console.log(raw);
        return false;
    }
}

module.exports = LogRiddleHandler;
