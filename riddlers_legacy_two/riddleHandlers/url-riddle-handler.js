"use strict";
const IRiddleHandler = require("./IRiddleHandler");

class UrlRiddleHandler extends IRiddleHandler{
    constructor(storage) {
        super(1, "URL", storage);
    }

    solve(formatting, data, raw) {
        let splittedData = data.split(":");
        let nums = splittedData[1].split(",");
        const URL = Buffer.from(splittedData[0], "base64").toString();
        this.log(`Format: ${formatting}; URL: ${URL}; nums: ${nums.join(", ")}`);
        
        

        return true;
    }
}

module.exports = UrlRiddleHandler;
