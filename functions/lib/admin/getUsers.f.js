"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const { DATABASE } = require("../helpers/constants");
const getCustomers = functions.https.onCall(async (datax, context) => {
    const userDetails = datax;
    const userProps = {
        startAt: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.startAt) || 0,
        limit: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.limit) || 20
    };
    console.log("Inspecting data object within onSearch: ", userProps);
    try {
        const db = firebase_admin_1.firestore();
        const userDB = db.collection(DATABASE.USER);
        const doc = await userDB.get();
        if (doc === null || doc === void 0 ? void 0 : doc.empty)
            return {};
        const result = [];
        doc === null || doc === void 0 ? void 0 : doc.forEach(doct => {
            const data = doct.data();
            result.push(Object.assign(Object.assign({}, data), { id: doct.id }));
        });
        console.log(result);
        const first20Customers = {
            totalSize: result.length,
            data: result.splice(userProps.startAt, result.length <= userProps.limit ? result.length : userProps.limit),
        };
        return first20Customers;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = getCustomers;
//# sourceMappingURL=getUsers.f.js.map