"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const { DATABASE } = require("../helpers/constants");
const getOrders = functions.https.onCall(async (datax, context) => {
    const orderDetails = datax;
    const orderProps = {
        startAt: (orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.startAt) || 0,
        limit: (orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.limit) || 20
    };
    console.log("Inspecting data object within onSearch: ", orderProps);
    try {
        const db = firebase_admin_1.firestore();
        const orderDB = db.collection(DATABASE.RIDERS);
        const doc = await orderDB.get();
        if (doc === null || doc === void 0 ? void 0 : doc.empty)
            return {};
        const result = [];
        doc === null || doc === void 0 ? void 0 : doc.forEach(doct => {
            const data = doct.data();
            result.push(Object.assign(Object.assign({}, data), { id: doct.id }));
        });
        console.log(result);
        const newResult = result.sort((a, b) => {
            if ((a === null || a === void 0 ? void 0 : a.numOfStores) <= (b === null || b === void 0 ? void 0 : b.numOfStores))
                return 1;
            if ((a === null || a === void 0 ? void 0 : a.numOfStores) > (b === null || b === void 0 ? void 0 : b.numOfStores))
                return -1;
            return 0;
        });
        const first20Order = {
            totalSize: newResult.length,
            data: newResult.splice(orderProps.startAt, newResult.length <= orderProps.limit ? newResult.length : orderProps.limit),
        };
        return first20Order;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = getOrders;
//# sourceMappingURL=getDisptachRider.f.js.map