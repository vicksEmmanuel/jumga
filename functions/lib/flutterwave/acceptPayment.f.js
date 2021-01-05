"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const acceptPayment = functions.https.onRequest(async (req, res) => {
    const body = req === null || req === void 0 ? void 0 : req.body;
    console.log("Flutterwave added some params", req.params);
    console.log("Flutterwave added some headers", req.headers);
    console.log("Flutterwave came here", body);
    res.send(200);
});
module.exports = acceptPayment;
//# sourceMappingURL=acceptPayment.f.js.map