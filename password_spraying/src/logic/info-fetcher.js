"use strict";
const fetch = require("node-fetch");
const https = require("https");
const events = require("events");

class ServiceInfo {
    /**
     * @param {string} service
     * @param {string|number} port
     * @param {string} usernames
     * @param {string} password
     * @memberof ServiceInfo
     */
    constructor(service, port, usernames, password) {
        this.service = service;
        this.port = port;
        this.usernames = usernames;
        this.password = password;
    }

    /**
     * @param {ServiceInfo} info
     * @returns {boolean}
     * @memberof ServiceInfo
     */
    isSame(info) {
        return this.service === info.service
            && this.port === info.port
            && this.usernames === info.usernames
            && this.password === info.password;
    }

    /**
     * @param {ServiceInfo} info
     * @returns {string[]}
     * @memberof ServiceInfo
     */
    getChanges(info) {
        const changes = [];
        if(this.service !== info.service) changes.push("service");
        if(this.port !== info.port) changes.push("port");
        if(this.usernames !== info.usernames) changes.push("usernames");
        if(this.password !== info.password) changes.push("password");
        return changes;
    }
}

class InfoHandler extends events.EventEmitter {
    /**
     * @param {string} url
     * @param {number} [refreshDelay=5000]
     * @memberof InfoHandler
     */
    constructor(url, refreshDelay = 5000) {
        super();
        this.url = url;
        this.refreshDelay = refreshDelay;
        /** @type {ServiceInfo[]} */
        this.currentInfos = [];

        this.startInterval();
    }

    /**
     * This function gets called every interval tick
     * @memberof InfoHandler
     */
    _intervalLoop() {
        this.fetchServiceInfos()
            .then(infos => {
                this.emit("fetch", infos);
                infos.forEach(info => {
                    const oldList = this.currentInfos.filter(a => a.service === info.service);
                    if(oldList.length > 0) {
                        const old = oldList[0];
                        if(!old.isSame(info)) {
                            this.emit(`change-${info.service}`, {old: old, new: info, changes: old.getChanges(info)});
                            this.emit("change", {old: old, new: info, changes: old.getChanges(info)});
                        }
                    }
                    else {
                        this.emit(`change-${info.service}`, {new: info});
                    }
                });
                this.currentInfos = infos;
            }).catch((err) => {
                this.emit("error", err);
            });
    }

    /**
     * @memberof InfoHandler
     */
    startInterval() {
        this.interval = setInterval(() => { this._intervalLoop(); }, this.refreshDelay);
    }

    /**
     * @memberof InfoHandler
     */
    stopInterval() {
        clearInterval(this.interval);
    }

    /**
     * @returns {Promise<ServiceInfo[]>}
     * @memberof InfoHandler
     */
    fetchServiceInfos() {
        return new Promise((res, rej) => {
            // @ts-ignore
            fetch(this.url, {
                agent: new https.Agent({
                    rejectUnauthorized: false
                })
            }).then(httpResult => httpResult.text()).then(body => {
                const pattern = /column1">(.*)<\/[\s\S]*?column2">(.*)<\/[\s\S]*?column3">(.*)<\/[\s\S]*?column4">(.*)</g;
                const matched = [...body.matchAll(pattern)].slice(1);
                const services = [];
                matched.forEach(match => {
                    services.push(new ServiceInfo(match[1], match[2], match[3], match[4]));
                });
                res(services);
            }).catch(rej);
        });
    }
}


module.exports = {
    ServiceInfo,
    InfoHandler
}
