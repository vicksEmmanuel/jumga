"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const Rave = require('./Rave.f');
const { FWPubKey, FWSecret } = require("../helpers/config");
const processPayment = functions.https.onCall((data, context) => {
    console.log("Is anything happening here???");
    if (!context.auth) {
        return { message: "Authentication Required!", code: 401 };
    }
    const cardDetails = data;
    console.log("Inspecting data object within processPayment method: ", cardDetails);
    console.log("FWPubKey == ", FWPubKey);
    console.log("FWSecret == ", FWSecret);
    const rave = new Rave(FWPubKey, FWSecret);
    return rave.initiatePayment(cardDetails).then((result) => {
        console.log("response from successful payment == ", result);
        return result;
    })
        .catch((error) => {
        console.log("error occured while attempting to process payment: ", error);
        console.log("error message == ", error.message);
        console.log("error message.error == ", error.message.error);
        // console.log("error message 400 == ", error.message["400"]);
        throw new functions.https.HttpsError('unknown', error.message, error);
    });
});
module.exports = processPayment;
//# sourceMappingURL=processPayment.f.js.map