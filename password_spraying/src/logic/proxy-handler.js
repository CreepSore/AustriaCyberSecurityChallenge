"use strict";
const fetch = require("node-fetch");
const proxyAgent = require("http-proxy-agent");

class ProxyData {
    constructor(host, port, type = "HTTP") {
        this.host = host;
        this.port = port;
        this.type = type;
    }
}

class ProxyHandler {
    /**
     * @param {ProxyData[]} proxyList
     * @memberof ProxyHandler
     */
    constructor(proxyList) {
        this._iterator = 0;
        this._proxys = proxyList;
    }

    /**
     * @returns {ProxyData}
     * @memberof ProxyHandler
     */
    currentProxy() {
        return this._proxys[this._iterator];
    }

    /**
     * @returns {ProxyData}
     * @memberof ProxyHandler
     */
    getNextProxy() {
        this._iterator++;
        return this.currentProxy();
    }

    /**
     * @param {number} [from=0]
     * @param {*} [to=-1]
     * @param {string} [testurl="https://google.com/"]
     * @returns {Promise<ProxyData[]>}
     * @memberof ProxyHandler
     */
    checkProxys(from = 0, to = -1, testurl = "https://www.webscantest.com/") {
        return new Promise(res => {
            const toCheck = this._proxys.splice(from, to > 0 ? to : this._proxys.length);
            const promises = [];
            const valid = [];
            toCheck.forEach((proxy, i) => {
                setTimeout(() => {
                    promises.push(fetch(testurl, {
                        // @ts-ignore
                        agent: function() {
                            return new proxyAgent.HttpProxyAgent(`http://${proxy.host}:${proxy.port}`);
                        }
                    }).then(hres => hres.text()).then(text => {
                        if(text.includes("<html>")) {
                            valid.push(proxy);
                            console.log(`[VALID][${proxy.host}:${proxy.port}] -> YES `);
                        }
                        else {
                            console.error(`[INVALID][${proxy.host}:${proxy.port}] -> NO `);
                        }
                    }).catch(err => {
                        console.error(`[INVALID][${proxy.host}:${proxy.port}] -> ${err} `);
                    }));
                }, i * 500);
            });
            Promise.all(promises).then(() => {res(valid);});
        });
    }
}

module.exports = {
    ProxyData,
    ProxyHandler
};
