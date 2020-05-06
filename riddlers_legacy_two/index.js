"use strict";
const net = require("net");
const fs = require("fs");
const KeyStorage = require("./logic/key-storage");
const RiddleHandlers = require("./riddleHandlers/riddle-handlers");

const mainStorage = new KeyStorage("GENERAL");
mainStorage.register("HOST", "152.96.7.10");
mainStorage.register("PORT", 2224);
mainStorage.register("RIDDLE_HANDLERS", []);

const setupHandlers = function() {
    let riddleHandlers = mainStorage.get("RIDDLE_HANDLERS");
    // riddleHandlers.push(new RiddleHandlers.LogRiddleHandler(mainStorage));
    riddleHandlers.push(new RiddleHandlers.MorseRiddlerHandler(mainStorage));
    riddleHandlers.push(new RiddleHandlers.UrlRiddleHandler(mainStorage));
    riddleHandlers.push(new RiddleHandlers.ReverseRiddleHandler(mainStorage));
    riddleHandlers.push(new RiddleHandlers.RotRiddleHandler(mainStorage));
    riddleHandlers.push(new RiddleHandlers.VigenereRiddleHandler(mainStorage));
    riddleHandlers.push(new RiddleHandlers.AsciiRiddleHandler(mainStorage));
};

const connect = async function() {
    let socket = net.connect(mainStorage.get("PORT"), mainStorage.get("HOST"));

    socket.on("connect", () => {
        mainStorage.registerObject("SOCKET", socket, true);
    });

    socket.on("data", buffer => {
        let str = buffer.toString().replace(/\n/g, "");
        let splitted = str.split(";");
        let actionId = parseInt(splitted[1]);
        let formatting = parseInt(splitted[0]);

        if(isNaN(actionId)) {
            console.log(`${str}`);
            return;
        }

        setTimeout(() => {
            let solved = false;
            mainStorage.get("RIDDLE_HANDLERS").forEach(riddleHandler => {
                if(solved || (actionId !== riddleHandler.handlerId && riddleHandler.handlerId !== -1)) return;
                solved = riddleHandler.solve(formatting, splitted[2], str);
            });
            if(!solved) {
                console.log(`UNSOLVED: ${str}`);
                if(!isNaN(actionId))socket.write("\n");
            }
        }, 1000);
    });
};

const main = function() {
    setupHandlers();
    connect();
};

main();