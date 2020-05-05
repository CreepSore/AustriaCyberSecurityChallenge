"use strict";
const IRiddleHandler = require("./IRiddleHandler");

class MorseRiddleHandler extends IRiddleHandler {
    constructor(storage) {
        super(4, "Morse", storage);

        this.morseMappingC = "abcdefghijklmnopqrstuvwxyz1234567890"
        this.morseMappingM = [
            /*A*/ ".-"   , "-..." , "-.-." , "-.."  , "."    , "..-.", "--.",
            /*H*/ "...." , ".."   , ".---" , "-.-"  , ".-.." , "--"  , "-." ,
            /*O*/ "---"  , ".--." , "--.-" , ".-."  , "..."  , "-"   , "..-",
            /*V*/ "...-" , ".--"  , "-..-" , "-.--" , "--.." ,
            /*1*/ ".----", "..---", "...--", "....-", ".....",
            /*6*/ "-....", "--...", "---..", "----.", "-----"
        ];
    }

    morseToString(morse) {
        if(!morse) return "";
        let res = this.morseMappingC[this.morseMappingM.indexOf(morse)];
        if(!res) {
            this.log(`INVALID MORSE: ${morse}`);
        }
        return res;
    }

    solve(formatting, data, raw) {
        let toProcess = data.split(" ");
        let result = "";
        toProcess.forEach(morse => {
            result += this.morseToString(morse);
        });

        if(formatting === 0) {
            result = result.toLowerCase();
        } else if(formatting === 1) {
            result = result.toUpperCase();
        }

        this.log(result);
        this.storage.get("SOCKET").write(`${result}\n`);
        return true;
    }
}

module.exports = MorseRiddleHandler;
