"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const _ = require("lodash");
const firebase_admin_1 = require("firebase-admin");
const uuid_1 = require("uuid");
const { DATABASE } = require("../helpers/constants");
const onCreateDispatchRiders = functions.https.onRequest(async (req, res) => {
    /**
     * TODO: Make this route accessible to admins
     */
    const body = req === null || req === void 0 ? void 0 : req.body;
    const dispatchRider = body === null || body === void 0 ? void 0 : body.dispatchRider;
    const errorMessage = () => {
        res.status(401).json({
            success: false,
            message: 'No dispatchRider parameter (dispatchRider) provided in body, please provide the categories in the format {name: "",...}',
            error: 'No dispatchRider parameter (dispatchRider) provided in body, please provide the categories in the format {name: "",...}'
        });
    };
    const db = firebase_admin_1.firestore();
    const batch = db.batch();
    console.log("Categories provided == ", dispatchRider);
    try {
        if (_.isEmpty(dispatchRider)) {
            errorMessage();
            return;
        }
        dispatchRider.map((item) => {
            const key = uuid_1.v4();
            const dispatchRiderDB = db.doc(`${DATABASE.RIDERS}/${key}`);
            batch.set(dispatchRiderDB, item);
        });
        await batch.commit();
        res.status(200).json({
            message: 'Dispatch Rider Created. Yay!!'
        });
    }
    catch (err) {
        console.log(`An Error occurred in categoriesSet `, err);
        res.status(500).json({
            success: false,
            error: err.message
        });
        return;
    }
});
module.exports = onCreateDispatchRiders;
//# sourceMappingURL=listCreate.f.js.map