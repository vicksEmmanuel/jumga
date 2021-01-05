"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const uuid_1 = require("uuid");
const Rave = require('./Rave');
const { FWPubKey, FWSecret, jumgaLogo, webhook } = require("../helpers/config");
// TODO: Retrieve cost and currency using remoteConfig
// const getRemoteConfig = async () => {
//   const config = admin.remoteConfig();
//   return await config.getTemplate();
// }
const processPayment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    const paymentDetails = data;
    console.log("Inspecting data object within processPayment method: ", paymentDetails);
    const rave = new Rave(FWPubKey, FWSecret);
    try {
        const pricey = await rave.getPriceAndCurrency(paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.currency, paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.currencyPricePerDollar);
        const paymentOptions = {
            tx_ref: uuid_1.v4(),
            amount: pricey.storeCost,
            redirect_url: webhook,
            currency: pricey.currency,
            payment_options: 'card, account, banktransfer',
            customer: {
                email: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.email,
                name: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.name,
                store_id: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.storename,
            },
            customization: {
                title: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.paymentTitle,
                description: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.description,
                logo: jumgaLogo,
            },
        };
        if (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.payment_plan) {
            paymentOptions['payment_plan'] = paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.payment_plan;
        }
        if (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.productId) {
            paymentOptions.customer['product_id'] = paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.productId;
        }
        const result = await rave.initiatePayment(paymentOptions);
        console.log("response from successful payment == ", result);
        return result;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = processPayment;
//# sourceMappingURL=processPayment.f.js.map