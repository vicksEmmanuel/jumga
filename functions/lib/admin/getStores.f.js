"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const { DATABASE } = require("../helpers/constants");
const getStores = functions.https.onCall(async (datax, context) => {
    const storeDetails = datax;
    const storeProps = {
        startAt: (storeDetails === null || storeDetails === void 0 ? void 0 : storeDetails.startAt) || 0,
        limit: (storeDetails === null || storeDetails === void 0 ? void 0 : storeDetails.limit) || 20
    };
    console.log("Inspecting data object within onSearch: ", storeProps);
    try {
        const db = firebase_admin_1.firestore();
        const storeDB = db.collection(DATABASE.STORE);
        const doc = await storeDB.get();
        if (doc === null || doc === void 0 ? void 0 : doc.empty)
            return {};
        const result = [];
        doc === null || doc === void 0 ? void 0 : doc.forEach(doct => {
            const data = doct.data();
            result.push(Object.assign(Object.assign({}, data), { id: doct.id }));
        });
        console.log(result);
        const newResult = result.sort((a, b) => {
            if ((a === null || a === void 0 ? void 0 : a.createdDate.toDate()) <= (b === null || b === void 0 ? void 0 : b.createdDate.toDate()))
                return 1;
            if ((a === null || a === void 0 ? void 0 : a.createdDate.toDate()) > (b === null || b === void 0 ? void 0 : b.createdDate.toDate()))
                return -1;
            return 0;
        });
        const first20Order = {
            totalSize: newResult.length,
            data: newResult.splice(storeProps.startAt, newResult.length <= storeProps.limit ? newResult.length : storeProps.limit),
        };
        return first20Order;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = getStores;
//# sourceMappingURL=getStores.f.js.map