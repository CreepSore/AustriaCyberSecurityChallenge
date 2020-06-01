"use strict";
const fetch = require("node-fetch");
const proxyAgent = require("http-proxy-agent");

const proxy = require("./proxy-handler");
const CredentialGenerator = require("./credential-generator");
const {InfoHandler, ServiceInfo} = require("./info-fetcher");

class HttpForcer {
    /**
     * @param {string} url
     * @param {InfoHandler} infoHandler
     * @param {CredentialGenerator} credentialGenerator
     * @param {proxy.ProxyHandler} proxyHandler
     * @memberof HttpForcer
     */
    constructor(url, infoHandler, credentialGenerator, proxyHandler) {
        this.url = url;
        this.proxyHandler = proxyHandler;
        this.infoHandler = infoHandler;
        this.credentialGenerator = credentialGenerator;
        this.useProxy = !!this.proxyHandler;

        this.infoHandler.on("change-http", info => {
            this.password = info.password;
        });

        this.credential = this.credentialGenerator.getNextCredential();
        this.proxy = this.proxyHandler
    }

    doRequest() {
        return new Promise((res, rej) => {
            let options = !this.useProxy ? {} : {
                agent: function() {
                    return new proxyAgent.HttpProxyAgent(`${proxy.}//${proxy.host}:${proxy.port}`);
                }
            };

            // @ts-ignore
            fetch(this.url, options).then(hres => {
                this.credential = this.credentialGenerator.getNextCredential();
                console.log(`${this.credential}:${this.password} -> ${hres.status()}`);
                if(hres.status() === 200) {
                    hres.text().then(str => {
                        console.log(`${this.credential}:${this.password} -> ${str}`);
                    });
                }
                res(hres.status());
            }).then(hres => hres.text()).catch(err => {
                console.error(`Failed: ${err}`);
                rej(err);
            });
        });
    }

}

module.exports = HttpForcer;
