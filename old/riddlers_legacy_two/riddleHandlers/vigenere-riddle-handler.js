"use strict";
const IRiddleHandler = require("./IRiddleHandler");

class VigenereRiddleHandler extends IRiddleHandler{
    constructor(storage) {
        super(7, "Vigenere", storage);
    }

    genRot(rot) {
        const alph = "abcdefghijklmnopqrstuvwxyz";
        let result = "";

        for(let i = 0; i < alph.length; i++) {
            let index = rot + i;
            while(index >= 26) index -= 26;
            result += alph[index];
        }

        return result;
    }

    genVig() {
        const alph = "abcdefghijklmnopqrstuvwxyz";
        let result = {};
        for(let i = 0; i < alph.length; i++) { // key
            const rot = this.genRot(i);
            for(let j = 0; j < alph.length; j++) { // msg
                if(!result[alph[i]]) result[alph[i]] = {rot: rot};
                result[alph[i]][alph[j]] = rot[j];
            }
        }
        return result;
    }

    doVig(key, str) {
        const alph = "abcdefghijklmnopqrstuvwxyz";
        let result = "";
        let vig = this.genVig();
        let index = 0;
        
        [...str].forEach(c => {
            result += alph[vig[key[index]].rot.indexOf(c)];
            index++;
            if(index >= key.length) {
                index = 0;
            }
        });

        return result;
    }

    solve(formatting, data, raw) {
        const splitted = data.split(":");
        const key = splitted[0];
        const str = splitted[1];
        let toSend = this.doVig(key, str);
        
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

module.exports = VigenereRiddleHandler;
