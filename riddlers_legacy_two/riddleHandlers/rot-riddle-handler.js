"use strict";
const IRiddleHandler = require("./IRiddleHandler");

class RotRiddleHandler extends IRiddleHandler{
    constructor(storage) {
        super(5, "Rot", storage);
    }

    doRot(str, direction = 1) {
        let result = [];
        [...str].forEach(c => {
            let code = c.charCodeAt(0);
            for(let i = 0; i < count; i++) {
                code += direction;
                if(code < 65) {
                    code = 90;
                } else if(code > 90) {
                    code = 65;
                }
            }
            result.push(String.fromCharCode(code));
        });
        return result.join("");
    }

    solve(formatting, data, raw) {
        const toSend = this.doRot(data, 1);
        this.log(toSend);
        this.storage.get("SOCKET").write(`${toSend}\n`);
        return true;
    }
}

module.exports = RotRiddleHandler;
