"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const { DATABASE } = require("../helpers/constants");
const getOrders = functions.https.onCall(async (datax, context) => {
    const historyDetails = datax;
    const historyProps = {
        email: historyDetails === null || historyDetails === void 0 ? void 0 : historyDetails.email,
        startAt: (historyDetails === null || historyDetails === void 0 ? void 0 : historyDetails.startAt) || 0,
        limit: (historyDetails === null || historyDetails === void 0 ? void 0 : historyDetails.limit) || 20
    };
    console.log("Inspecting data object within onSearch: ", historyProps);
    try {
        const db = firebase_admin_1.firestore();
        const orderDB = db.collection(DATABASE.ORDER);
        const query = orderDB.where('email', '==', historyProps.email);
        const doc = await query.get();
        if (doc === null || doc === void 0 ? void 0 : doc.empty)
            return {};
        const result = [];
        doc === null || doc === void 0 ? void 0 : doc.forEach(doct => {
            const data = doct.data();
            result.push(Object.assign(Object.assign({}, data), { id: doct.id }));
        });
        console.log(result);
        const newResult = result.sort((a, b) => {
            if ((a === null || a === void 0 ? void 0 : a.orderDate.toDate()) <= (b === null || b === void 0 ? void 0 : b.orderDate.toDate()))
                return 1;
            if ((a === null || a === void 0 ? void 0 : a.orderDate.toDate()) > (b === null || b === void 0 ? void 0 : b.orderDate.toDate()))
                return -1;
            return 0;
        });
        const first20Order = {
            totalSize: newResult.length,
            data: newResult.splice(historyProps.startAt, newResult.length <= historyProps.limit ? newResult.length : historyProps.limit),
        };
        return first20Order;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = getOrders;
//# sourceMappingURL=getHistory.f.js.map