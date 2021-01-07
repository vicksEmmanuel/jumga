"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const { DATABASE } = require("../helpers/constants");
const getProduct = functions.https.onCall(async (data, context) => {
    const productId = data.id;
    console.log("Inspecting data object within getProduct method: ", productId);
    try {
        const db = firebase_admin_1.firestore();
        const productDB = db.doc(`${DATABASE.PRODUCT}/${productId}`);
        const doc = await productDB.get();
        if (!doc.exists)
            return {};
        const storeDB = db.collection(DATABASE.PRODUCT);
        const query = storeDB.where("storeId", '==', doc.data().storeId).limit(5);
        const queryData = await query.get();
        const x = () => {
            const tmp = [];
            queryData.forEach(t => {
                tmp.push(Object.assign(Object.assign({}, t.data()), { productId: t.id }));
            });
            return tmp;
        };
        const result = {
            product: doc.data(),
            extraProductFromStore: queryData.empty ? [] : x()
        };
        console.log("response from successful payment == ", result);
        return result;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = getProduct;
//# sourceMappingURL=getProduct.f.js.map