"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const moment = require('moment');
const db = firebase_admin_1.firestore();
const { DATABASE } = require("../helpers/constants");
const scheduledFunction = functions.pubsub.schedule('every 72 hours').onRun(async (context) => {
    console.log('This function will be run every 72 hours!');
    const batch = db.batch();
    const paymentHolderDB = db.collection(`${DATABASE.PAYMENTHOLDER}`);
    const todaysMoment = moment(Date.now());
    console.log("Todays Moment == ", todaysMoment.toDate());
    const query = paymentHolderDB.where('createdDate', '<=', todaysMoment.toDate()).limit(400);
    const docs = await query.get();
    if (docs.empty) {
        return null;
    }
    docs.forEach(doc => {
        console.log("There and ther");
        console.log(doc.data());
        if (todaysMoment.diff(moment(doc.data().createdDate.toDate()), 'days') > 2) {
            batch.delete(doc.ref);
        }
    });
    await batch.commit();
    return null;
});
module.exports = scheduledFunction;
//# sourceMappingURL=deleteRedundantRefKey.f.js.map