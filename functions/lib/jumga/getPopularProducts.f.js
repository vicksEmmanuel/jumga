"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const { DATABASE } = require("../helpers/constants");
const getPopularProducts = functions.https.onCall(async (datax, context) => {
    try {
        const db = firebase_admin_1.firestore();
        const orderDB = db.collection(DATABASE.ORDER);
        const doc = await orderDB.limit(2000).get();
        if (doc === null || doc === void 0 ? void 0 : doc.empty)
            return {};
        const result = [];
        doc === null || doc === void 0 ? void 0 : doc.forEach(doct => {
            const data = doct.data();
            const x = result.findIndex(item => {
                return (item === null || item === void 0 ? void 0 : item.productId) === (data === null || data === void 0 ? void 0 : data.productId);
            });
            if (x === -1) {
                result.push({
                    productId: data === null || data === void 0 ? void 0 : data.productId,
                    history: [Object.assign({}, data)]
                });
            }
            else {
                const history = result[x].history;
                history.push(Object.assign({}, data));
                history.sort((a, b) => {
                    if ((a === null || a === void 0 ? void 0 : a.orderDate.toDate()) <= (b === null || b === void 0 ? void 0 : b.orderDate.toDate()))
                        return 1;
                    if ((a === null || a === void 0 ? void 0 : a.orderDate.toDate()) > (b === null || b === void 0 ? void 0 : b.orderDate.toDate()))
                        return -1;
                    return 0;
                });
                result[x] = Object.assign(Object.assign({}, result[x]), { history });
            }
        });
        const rep = result.sort((a, b) => {
            if ((a === null || a === void 0 ? void 0 : a.history.length) <= (b === null || b === void 0 ? void 0 : b.history.length))
                return 1;
            if ((a === null || a === void 0 ? void 0 : a.history.length) > (b === null || b === void 0 ? void 0 : b.history.length))
                return -1;
            return 0;
        });
        console.log(result);
        const first20Customers = {
            totalSize: result.length,
            data: rep.length > 10 ? rep.splice(0, 10) : rep,
        };
        return first20Customers;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = getPopularProducts;
//# sourceMappingURL=getPopularProducts.f.js.map