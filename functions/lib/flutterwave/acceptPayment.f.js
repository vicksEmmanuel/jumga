"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const _ = require("lodash");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const { jumgaHashKey } = require("../helpers/config");
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
                    const paymentHolder = db.doc(`${DATABASE.PAYMENTHOLDER}/${bodyX.tx_ref}`);
                    const paymentHolderRef = await paymentHolder.get();
                    console.log("DOes it exist? == ", paymentHolderRef.exists);
                    if (paymentHolderRef.exists) {
                        const data = paymentHolderRef.data();
                        console.log("The Data == ", data);
                        if (data.type === PAYMENTTYPE.STORE) {
                            await db.runTransaction(async (t) => {
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
                            });
                        }
                        //TODO: Add a else taking in product payment
                    }
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