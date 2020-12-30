"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_forge_1 = require("node-forge");
const request_promise_native_1 = require("request-promise-native");
const md5_1 = require("md5");
// const forge = require("node-forge");
// const request = require("request-promise-native");
// const md5 = require("md5");
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
    initiatePayment(card_details) {
        const options = {
            url: "",
            method: "",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: {
                "PBFPubKey": "",
                "alg": "3DES-24",
                client: "",
            },
            json: true
        };
        return new Promise((resolve, reject) => {
            const encrypted_card_details = card_details; //this.encryptCardDetails(card_details);
            const payment_options = Object.assign({}, options);
            payment_options.url = raveEndpoint;
            payment_options.body.client = encrypted_card_details;
            payment_options.method = "POST";
            payment_options.body.PBFPubKey = this.public_key; // set public key
            console.log("payment_options == ", payment_options);
            request_promise_native_1.default(payment_options)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
}
module.exports = Rave;
//# sourceMappingURL=Rave.f.js.map