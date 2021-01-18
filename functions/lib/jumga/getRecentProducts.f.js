"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const { DATABASE } = require("../helpers/constants");
const getRecentProducts = functions.https.onCall(async (data, context) => {
    try {
        const db = firebase_admin_1.firestore();
        const productDB = db.collection(`${DATABASE.PRODUCT}`);
        const doc = await productDB.limit(10).get();
        console.log("What is the doc size", doc.size);
        if (doc.empty)
            return [];
        const tmp = [];
        doc.forEach(t => {
            tmp.push(Object.assign(Object.assign({}, t.data()), { productId: t.id }));
        });
        return tmp;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = getRecentProducts;
//# sourceMappingURL=getRecentProducts.f.js.map