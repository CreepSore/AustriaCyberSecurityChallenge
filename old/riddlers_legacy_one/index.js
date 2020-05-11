const net = require("net");
const fs = require("fs");

const HOST = "152.96.7.15";
const PORT = 2223

let connect = async function() {
    let socket = net.connect(PORT, HOST);

    let flag = "";
    let dir = -1;
    let old = 0;
    socket.on("data", buffer => {
        let str = buffer.toString().replace(/\n/g, "");
        let splitted = str.split(":");
        let count = parseInt(splitted[0]);

        if(splitted.length > 1) {
            console.log(str);
            [...splitted[1]].forEach(c => {
                let code = c.charCodeAt(0);
                for(let i = 0; i < count; i++) {
                    code += dir;
                    if(code < 65) {
                        code = 90;
                    } else if(code > 90) {
                        code = 65;
                    }
                }
                let str = String.fromCharCode(code);
                socket.write(str);
            });
            socket.write("\n");
        }
        else if(str.includes("GAME")) {
            console.log(str);
        }
        else {
            flag += splitted[0];
            console.log(splitted[0]);
        }
    });
};

connect();