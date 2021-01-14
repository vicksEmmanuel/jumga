"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const { DATABASE } = require("../helpers/constants");
const getCustomers = functions.https.onCall(async (datax, context) => {
    const orderDetails = datax;
    const orderProps = {
        storeId: orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.storeId,
        startAt: (orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.startAt) || 0,
        limit: (orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.limit) || 20
    };
    console.log("Inspecting data object within onSearch: ", orderProps);
    try {
        const db = firebase_admin_1.firestore();
        const orderDB = db.collection(DATABASE.ORDER);
        const query = orderDB.where('storeId', '==', orderProps.storeId);
        const doc = await query.get();
        if (doc === null || doc === void 0 ? void 0 : doc.empty)
            return {};
        const result = [];
        doc === null || doc === void 0 ? void 0 : doc.forEach(doct => {
            const data = doct.data();
            const x = result.findIndex(item => {
                return (item === null || item === void 0 ? void 0 : item.customer) === (data === null || data === void 0 ? void 0 : data.email);
            });
            if (x === -1) {
                result.push({
                    customer: data === null || data === void 0 ? void 0 : data.email,
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
        console.log(result);
        const first20Customers = {
            totalSize: result.length,
            data: result.splice(orderProps.startAt, result.length <= orderProps.limit ? result.length : orderProps.limit),
        };
        return first20Customers;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = getCustomers;
//# sourceMappingURL=getCustomers.f.js.map