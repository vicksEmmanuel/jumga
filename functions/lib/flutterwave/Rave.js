"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_forge_1 = require("node-forge");
const md5_1 = require("md5");
const axios_1 = require("axios");
const { raveEndpoint } = require("../helpers/config");
class Rave {
    /**
     * Rave object constructor
     * @param {*} public_key This is a string that can be found in merchant rave dashboard
     * @param {*} secret_key This is a string that can be found in merchant rave dashboard
     */
    constructor(public_key, secret_key) {
        this.public_key = public_key;
        this.secret_key = secret_key;
    }
    encryptCardDetails(cardDetails) {
        const card_details = JSON.stringify(cardDetails);
        const cipher = node_forge_1.default.cipher.createCipher("3DES-ECB", node_forge_1.default.util.createBuffer(this.getKey()));
        cipher.start({ iv: "" });
        cipher.update(node_forge_1.default.util.createBuffer(card_details, "utf-8"));
        cipher.finish();
        const encrypted = cipher.output;
        return node_forge_1.default.util.encode64(encrypted.getBytes());
    }
    getKey() {
        const sec_key = this.secret_key;
        const keymd5 = md5_1.default(sec_key);
        const keymd5last12 = keymd5.substr(-12);
        const seckeyadjusted = sec_key.replace("FLWSECK-", "");
        const seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12);
        return seckeyadjustedfirst12 + keymd5last12;
    }
    initiatePayment(paymentDetails) {
        const paymentOptions = {
            headers: {
                'Authorization': `Bearer ${this.secret_key}`
            },
        };
        return new Promise((resolve, reject) => {
            console.log("payment_options == ", paymentOptions);
            axios_1.default.post(raveEndpoint, paymentDetails, paymentOptions)
                .then(result => {
                resolve(result);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
}
module.exports = Rave;
//# sourceMappingURL=Rave.js.map