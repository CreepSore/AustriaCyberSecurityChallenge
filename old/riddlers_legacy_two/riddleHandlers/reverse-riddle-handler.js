"use strict";
const IRiddleHandler = require("./IRiddleHandler");

class ReverseRiddleHandler extends IRiddleHandler{
    constructor(storage) {
        super(5, "Reverse", storage);
    }

    solve(formatting, data, raw) {
        let toSend = Array.from(data).reverse().join("");
        if(toSend === 0) {
            toSend = toSend.toLowerCase();
        } else if(toSend === 1) {
            toSend = toSend.toUpperCase();
        }

        this.log(toSend);
        this.storage.get("SOCKET").write(`${toSend}\n`);
        return true;
    }
}

module.exports = ReverseRiddleHandler;
