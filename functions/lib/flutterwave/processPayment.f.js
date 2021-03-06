"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryCost = exports.getTotal = exports.getAddUpValues = exports.getCartPriceBasedOnUser = void 0;
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const _ = require("lodash");
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
exports.getCartPriceBasedOnUser = async (email) => {
    const doc = firebase_admin_1.firestore().collection(DATABASE.CART);
    const docRef = doc.where('email', '==', email);
    const docData = await docRef.get();
    if (docData.empty)
        throw new Error("Something went wrong");
    const cart = [];
    docData.forEach(i => {
        cart.push(Object.assign(Object.assign({}, i.data()), { id: i.id }));
    });
    if (_.isEmpty(cart))
        throw new Error("Something went wrong");
    const total = exports.getTotal(cart);
    return total;
};
exports.getAddUpValues = (cart) => {
    let x = 0;
    cart.forEach(item => {
        x += Number(item === null || item === void 0 ? void 0 : item.total);
    });
    return x;
};
exports.getTotal = (cart) => {
    const discount = exports.getDeliveryCost(cart);
    const totalprice = exports.getAddUpValues(cart);
    return Number(discount) + Number(totalprice);
};
exports.getDeliveryCost = (cart) => {
    let delivery = 0;
    cart.forEach(item => {
        delivery += (Number(item === null || item === void 0 ? void 0 : item.deliverycost) * (item === null || item === void 0 ? void 0 : item.quantity));
    });
    return delivery;
};
const processPayment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    const paymentDetails = data;
    console.log("Inspecting data object within processPayment method: ", paymentDetails);
    const rave = new Rave(FWPubKey, FWSecret);
    try {
        const reference = uuid_1.v4();
        const paymentOptions = {
            tx_ref: reference,
            redirect_url: webhook,
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
            amount: 0,
            type: PAYMENTTYPE.STORE
        };
        if (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.payment_plan) {
            paymentOptions['payment_plan'] = paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.payment_plan;
        }
        if (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.sell) {
            const totalCartPrice = await exports.getCartPriceBasedOnUser(paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.email);
            const pricey = await rave.getTotalCostOfCart(paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.currency, paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.currencyPricePerDollar, totalCartPrice);
            paymentOptions['amount'] = pricey.cost;
            paymentOptions['currency'] = pricey.currency;
            paymentOptions['type'] = PAYMENTTYPE.PRODUCT;
        }
        else {
            const pricey = await rave.getPriceAndCurrency(paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.currency, paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.currencyPricePerDollar);
            paymentOptions['amount'] = pricey.cost;
            paymentOptions['currency'] = pricey.currency;
            paymentOptions['type'] = PAYMENTTYPE.STORE;
        }
        const result = await rave.initiatePayment(paymentOptions);
        const db = firebase_admin_1.firestore();
        const paymentHolderDB = db.doc(`${DATABASE.PAYMENTHOLDER}/${reference}`);
        const paymentHolderRef = db.collection(DATABASE.PAYMENTHOLDER);
        const queryRef = paymentHolderRef.where('email', '==', paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.email);
        await db.runTransaction(async (t) => {
            const allRefs = await t.get(queryRef);
            (await allRefs).forEach(async (doc) => {
                await t.delete(doc.ref);
            });
            await t.set(paymentHolderDB, {
                paymentRef: reference,
                paid: false,
                storeId: (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.storename) || null,
                email: (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.email) || null,
                phone: (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.phone) || null,
                address: (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.address) || null,
                country: paymentDetails.country || null,
                state: (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.state) || null,
                note: (paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.note) || null,
                amount: paymentOptions === null || paymentOptions === void 0 ? void 0 : paymentOptions.amount,
                type: paymentOptions === null || paymentOptions === void 0 ? void 0 : paymentOptions.type,
                createdDate: firebase_admin_1.firestore.Timestamp.fromDate(moment().toDate()),
            });
        });
        console.log("response from successful payment == ", result);
        return Object.assign(Object.assign({}, result), { reference });
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = processPayment;
//# sourceMappingURL=processPayment.f.js.map