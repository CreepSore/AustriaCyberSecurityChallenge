"use strict";
const IRiddleHandler = require("./IRiddleHandler");

class UrlRiddleHandler extends IRiddleHandler{
    constructor(storage) {
        super(1, "URL", storage);
    }

    solve(formatting, data, raw) {
        const text = "I have deposited in the county of Bedford, about four miles from Buford's, in an excavation or vault, six feet below the surface of the ground, the following articles, belonging jointly to the parties whose names are given in number three, herewith. The first deposit consisted of ten hundred and fourteen pounds of gold, and thirty-eight hundred and twelve pounds of silver, deposited Nov. eighteen nineteen. The second was made Dec. eighteen twenty-one, and consisted of nineteen hundred and seven pounds of gold, and twelve hundred and eighty-eight of silver; also jewels, obtained in St. Louis in exchange for silver to save transportation, and valued at thirteen thousand dollars. The above is securely packed in iron pots, with iron covers. The vault is roughly lined with stone, and the vessels rest on solid stone, and are covered with others. Paper number one describes the exact locality of the vault, so that no difficulty will be had in finding it. this is a random sensless sentence to expand this text that you can solve this case, unfortunately it will not enhance quality. we hope you enjoy the Karcame ;) zonk. xorx.";
        const splittedText = text.split(" ");
        let splittedData = data.split(":");
        let nums = splittedData[1].split(",");
        const URL = Buffer.from(splittedData[0], "base64").toString();
        let toSend = "";

        nums.forEach(num => {
            toSend += splittedText[num-1][0]
        });

        this.log(`${toSend}, (${nums.join(", ")})`);
        this.storage.get("SOCKET").write(`${toSend}\n`);
        return true;
    }
}

module.exports = UrlRiddleHandler;
