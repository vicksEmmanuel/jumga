"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const moment = require('moment');
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const uuid_1 = require("uuid");
const Rave = require('./Rave');
const { FWPubKey, FWSecret, jumgaLogo, webhook } = require("../helpers/config");
const { DATABASE, PAYMENTTYPE } = require("../helpers/constants");
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
        const reference = uuid_1.v4();
        const paymentOptions = {
            tx_ref: reference,
            amount: pricey.storeCost,
            redirect_url: webhook,
            currency: pricey.currency,
            payment_options: 'card',
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
            //TODO: Find price of item add it to paymentOptions.amount
        }
        const result = await rave.initiatePayment(paymentOptions);
        const db = firebase_admin_1.firestore();
        const paymentHolderDB = db.doc(`${DATABASE.PAYMENTHOLDER}/${reference}`);
        await paymentHolderDB.set({
            paymentRef: reference,
            email: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.email,
            amount: pricey.storeCost,
            type: PAYMENTTYPE.STORE,
            storeId: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.storename,
            paid: false,
            createdDate: firebase_admin_1.firestore.Timestamp.fromDate(moment().toDate()),
        });
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