"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const moment = require('moment');
const { DATABASE } = require("../helpers/constants");
const processDelivery = functions.https.onCall(async (datax, context) => {
    const orderDetails = datax;
    const orderProps = {
        id: orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.id
    };
    console.log("Inspecting data object within onSearch: ", orderProps);
    try {
        const db = firebase_admin_1.firestore();
        const orderDB = db.collection(DATABASE.ORDER);
        const storeDB = db.collection(DATABASE.STORE);
        const dispatchRidersDB = db.collection(DATABASE.RIDERS);
        const jumgaDB = db.collection(DATABASE.JUMGA);
        await db.runTransaction(async (t) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const orderToGet = orderDB.doc(orderProps.id);
            const order = await t.get(orderToGet);
            const storeToGet = storeDB.doc((_a = order.data()) === null || _a === void 0 ? void 0 : _a.storeId);
            const store = await t.get(storeToGet);
            const dispatchRidersToGet = dispatchRidersDB.doc((_b = store.data()) === null || _b === void 0 ? void 0 : _b.dispatchRiders);
            const dispatchRiders = await t.get(dispatchRidersToGet);
            await t.update(orderToGet, { isDelivered: true });
            const newStorePendingBalance = Number((_c = store.data()) === null || _c === void 0 ? void 0 : _c.pendingBalance) - Number((_d = order.data()) === null || _d === void 0 ? void 0 : _d.totalCostOfSales);
            const newRevenue = Number((_e = store.data()) === null || _e === void 0 ? void 0 : _e.walletBalance) + Number((_f = order.data()) === null || _f === void 0 ? void 0 : _f.totalCostOfSales);
            await t.update(storeToGet, {
                pendingBalance: newStorePendingBalance,
                walletBalance: newRevenue
            });
            const newDeliveryWalletBalance = Number((_g = dispatchRiders.data()) === null || _g === void 0 ? void 0 : _g.walletBalance) + Number((_h = order.data()) === null || _h === void 0 ? void 0 : _h.totalCostOfDelivery);
            await t.update(dispatchRidersToGet, {
                walletBalance: newDeliveryWalletBalance
            });
            await t.set(jumgaDB.doc(), {
                commissionFromSales: (_j = order.data()) === null || _j === void 0 ? void 0 : _j.totalCostOfCommissionOnSales,
                commissionFromDelivery: (_k = order.data()) === null || _k === void 0 ? void 0 : _k.totalcostOfCommissionOnDelivery,
                createdDate: firebase_admin_1.firestore.Timestamp.fromDate(moment().toDate())
            });
        });
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = processDelivery;
//# sourceMappingURL=processDelivery.f.js.map