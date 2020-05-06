"use strict";
const IRiddleHandler = require("./IRiddleHandler");

class RotRiddleHandler extends IRiddleHandler{
    constructor(storage) {
        super(5, "Rot", storage);
    }

    doRot(string, n) {
        const lowercase = "abcdefghijklmnopqrstuvwxyz";

		if (n == null) {
			n = 13;
		}
		n = Number(n);
		string = String(string);
		if (n == 0) {
			return string;
		}
		if (n < 0) { // decode instead of encode
			n += 26;
		}
		let length = string.length; // note: no need to account for astral symbols
		let index = -1;
		let result = '';
		let character;
		let currentPosition;
		let shiftedPosition;
		while (++index < length) {
			character = string.charAt(index).toLowerCase();
            currentPosition = lowercase.indexOf(character);
            shiftedPosition = (currentPosition + n) % 26;
            result += lowercase.charAt(shiftedPosition);
		}
		return result;
	};

    solve(formatting, data, raw) {
        const count = parseInt(data.split(":")[0]);
        const str = data.split(":")[1];
        let toSend = this.doRot(str.toLowerCase(), count);

        this.log(toSend);
        this.storage.get("SOCKET").write(`${toSend}\n`);
        return true;
    }
}

module.exports = RotRiddleHandler;
