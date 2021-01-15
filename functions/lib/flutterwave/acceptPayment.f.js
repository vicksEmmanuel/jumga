"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const _ = require("lodash");
const moment = require('moment');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const { jumgaHashKey, deliveryComissionPercentage, salesCommissionPercentage } = require("../helpers/config");
const { DATABASE, PAYMENTTYPE } = require("../helpers/constants");
app.post('/', async (req, res) => {
    try {
        console.log("Headers are ===", JSON.stringify(req.headers));
        const hash = req.headers["verif-hash"];
        if (hash) {
            if (hash === jumgaHashKey) {
                console.log("Entered payment handle block");
                const request_json = _.isObject(req.body) ? req.body : JSON.parse(req.body);
                console.log("request.body.data == ", request_json);
                if (request_json["event"] === 'charge.completed') {
                    const bodyX = request_json === null || request_json === void 0 ? void 0 : request_json.data;
                    const db = firebase_admin_1.firestore();
                    console.log("Payment tx_re ===", `${DATABASE.PAYMENTHOLDER}/${bodyX.tx_ref}`);
                    await db.runTransaction(async (t) => {
                        const paymentHolder = db.doc(`${DATABASE.PAYMENTHOLDER}/${bodyX.tx_ref}`);
                        const paymentHolderRef = await t.get(paymentHolder);
                        const orderCollection = DATABASE.ORDER;
                        const orderDetailsRef = db.collection(orderCollection);
                        console.log("DOes it exist? == ", paymentHolderRef.exists);
                        if (paymentHolderRef.exists) {
                            const data = paymentHolderRef.data();
                            console.log("The Data == ", data);
                            if (data.type === PAYMENTTYPE.STORE) {
                                const dbStoreRef = db.doc(`${DATABASE.STORE}/${data.storeId}`);
                                const storeDoc = await t.get(dbStoreRef);
                                console.log(storeDoc);
                                const storePaymentDate = storeDoc.data().paymentDates;
                                storePaymentDate.unshift({
                                    amount: bodyX.amount,
                                    email: bodyX.customer.email,
                                    paymentTxRef: bodyX.tx_ref,
                                    paymentFLWRef: bodyX.flw_ref,
                                    currency: bodyX.currency,
                                    date: new Date(bodyX.created_at),
                                });
                                await t.update(dbStoreRef, {
                                    approved: true,
                                    paymentDates: storePaymentDate
                                });
                                await t.delete(paymentHolder);
                            }
                            else {
                                //Get cart data;
                                const cartDB = db.collection(DATABASE.CART);
                                const cartRef = cartDB.where("email", '==', data === null || data === void 0 ? void 0 : data.email);
                                const cartData = await t.get(cartRef);
                                const cartHolder = [];
                                //calculate percentage commission
                                let salesCommission = 0;
                                let sales = 0;
                                let deliveryCostCommission = 0;
                                let deliveryCost = 0;
                                cartData.forEach(item => {
                                    const cartItem = item.data();
                                    const costPerOneItem = Number(cartItem === null || cartItem === void 0 ? void 0 : cartItem.currentprice);
                                    const quantity = Number(cartItem === null || cartItem === void 0 ? void 0 : cartItem.quantity);
                                    const costPerOneDelivery = Number(cartItem === null || cartItem === void 0 ? void 0 : cartItem.deliverycost);
                                    const singleItemDeliveryComission = costPerOneDelivery * deliveryComissionPercentage;
                                    const storeDeliveryCostAfterDeductingCommission = costPerOneDelivery - singleItemDeliveryComission;
                                    const totalCostOfDelivery = (storeDeliveryCostAfterDeductingCommission * quantity);
                                    const totalCostOfDeliveryCommission = (singleItemDeliveryComission * quantity);
                                    deliveryCost = deliveryCost + totalCostOfDelivery;
                                    deliveryCostCommission = deliveryCostCommission + totalCostOfDeliveryCommission;
                                    const singleItemSalesCommission = costPerOneItem * salesCommissionPercentage;
                                    const storeSalesCostAfterDeductingCommission = costPerOneItem - singleItemSalesCommission;
                                    const totalCostOfSales = (storeSalesCostAfterDeductingCommission * quantity);
                                    const totalCostOfSalesCommission = (singleItemSalesCommission * quantity);
                                    sales = sales + totalCostOfSales;
                                    salesCommission = salesCommission + totalCostOfSalesCommission;
                                    cartHolder.push(Object.assign(Object.assign({}, cartItem), { 
                                        //Deliveries
                                        costOfDeliveryPerItem: storeDeliveryCostAfterDeductingCommission, totalCostOfDelivery: totalCostOfDelivery, commissionOnDeliveryPerItem: singleItemDeliveryComission, totalcostOfCommissionOnDelivery: totalCostOfDeliveryCommission, 
                                        //Sales
                                        costOfSalesPerItem: storeSalesCostAfterDeductingCommission, totalCostOfSales: totalCostOfSales, commissionOnSalesPerItem: singleItemSalesCommission, totalCostOfCommissionOnSales: totalCostOfSalesCommission, ref: item.ref, shipping: {
                                            email: (data === null || data === void 0 ? void 0 : data.email) || null,
                                            phone: (data === null || data === void 0 ? void 0 : data.phone) || null,
                                            address: (data === null || data === void 0 ? void 0 : data.address) || null,
                                            country: data.country || null,
                                            state: (data === null || data === void 0 ? void 0 : data.state) || null,
                                            note: (data === null || data === void 0 ? void 0 : data.note) || null,
                                        }, isDelivered: false, status: 'not delivered', isSentToDeliveryTeam: false, refunded: false, orderDate: firebase_admin_1.firestore.Timestamp.fromDate(moment().toDate()), paymentData: {
                                            amount: bodyX.amount,
                                            email: bodyX.customer.email,
                                            paymentTxRef: bodyX.tx_ref,
                                            paymentFLWRef: bodyX.flw_ref,
                                            currency: bodyX.currency,
                                            date: new Date(bodyX.created_at),
                                        } }));
                                    /**
                                    * After 7 days
                                    * Will check if refund status is false, before depositing the money into store wallet and delivery wallet
                                    */
                                });
                                await Promise.all(cartHolder.map(async (item) => {
                                    var _a;
                                    //update store pending wallet
                                    const storeDB = db.doc(`${DATABASE.STORE}/${item === null || item === void 0 ? void 0 : item.storeId}`);
                                    const storeDBRef = await t.get(storeDB);
                                    //create an order                   
                                    await t.set(orderDetailsRef.doc(), Object.assign(Object.assign({}, item), { ref: null }));
                                    const newPendingWalletBalance = Number((_a = storeDBRef === null || storeDBRef === void 0 ? void 0 : storeDBRef.data()) === null || _a === void 0 ? void 0 : _a.pendingBalance) + Number(item === null || item === void 0 ? void 0 : item.totalCostOfSales);
                                    await t.update(storeDB, { pendingBalance: newPendingWalletBalance });
                                    //Delete cart of user;
                                    await t.delete(item.ref);
                                }));
                                await t.delete(paymentHolder);
                            }
                        }
                    });
                }
            }
        }
        res.status(200);
    }
    catch (err) {
        console.log(err);
        res.status(200);
    }
});
module.exports = functions.https.onRequest(app);
//# sourceMappingURL=acceptPayment.f.js.map