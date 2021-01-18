"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const { DATABASE } = require("../helpers/constants");
const getRandomStores = functions.https.onCall(async (data, context) => {
    try {
        const db = firebase_admin_1.firestore();
        const storeDB = db.collection(`${DATABASE.STORE}`);
        const doc = await storeDB.limit(10).get();
        if (!doc.empty)
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
module.exports = getRandomStores;
//# sourceMappingURL=getRandomStore.f.js.map