"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const uuid_1 = require("uuid");
const Rave = require('./Rave');
const { FWPubKey, FWSecret, jumgaLogo } = require("../helpers/config");
const getRemoteConfig = async () => {
    const config = admin.remoteConfig();
    return await config.getTemplate();
};
const processPayment = functions.https.onRequest(async (req, res) => {
    // if (!context.auth) {
    //   return { message: "Authentication Required!", code: 401 };
    // }
    const data = req === null || req === void 0 ? void 0 : req.body;
    const remoteConfig = await getRemoteConfig();
    res.status(200).json(remoteConfig);
    return;
    const paymentDetails = data;
    console.log("Inspecting data object within processPayment method: ", paymentDetails);
    const rave = new Rave(FWPubKey, FWSecret);
    return rave.initiatePayment({
        tx_ref: uuid_1.v4(),
        amount: 20,
        redirect_url: "https://webhook.site/43328766-3fe9-40f8-a981-c84189c18f61",
        currency: 'USD',
        payment_options: 'card',
        customer: {
            email: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.email,
            name: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.name
        },
        customization: {
            title: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.paymentTitle,
            description: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.description,
            logo: jumgaLogo,
        }
    }).then((result) => {
        console.log("response from successful payment == ", result);
        res.status(200).json(result);
        return result;
    })
        .catch((error) => {
        console.log("error occured while attempting to process payment: ", error);
        res.status(404).json(error);
        throw new functions.https.HttpsError('unknown', error.message, error);
        return error;
    });
});
module.exports = processPayment;
//# sourceMappingURL=processPayment.f.js.map