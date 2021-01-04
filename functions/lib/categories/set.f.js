"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const _ = require("lodash");
const firebase_admin_1 = require("firebase-admin");
const onSetProductCategories = functions.https.onRequest(async (req, res) => {
    /**
     * TODO: Make this route accessible to admins
     */
    const body = req === null || req === void 0 ? void 0 : req.body;
    const categories = body === null || body === void 0 ? void 0 : body.categories;
    const errorMessage = () => {
        res.status(401).json({
            success: false,
            message: 'No category parameter (categories) provided in body, please provide the categories in the format {BabyProduct: [shoes,cloth, ...]}',
            error: 'No category parameter (categories) provided in body, please provide the categories in the format {BabyProduct: [shoes,cloth, ...]}'
        });
    };
    const db = firebase_admin_1.firestore();
    const categoriesDB = db.collection('categories');
    console.log("Categories provided == ", categories);
    try {
        if (_.isEmpty(categories)) {
            errorMessage();
            return;
        }
        await db.runTransaction(async (t) => {
            await Promise.all(Object.keys(categories).map(el => {
                const docRef = categoriesDB.doc(el);
                // const docData = await t.get(docRef);
                t.set(docRef, Object.assign({}, categories[el]));
            }));
        });
        res.status(401).json({
            message: 'Categories set. Yay!!'
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
module.exports = onSetProductCategories;
//# sourceMappingURL=set.f.js.map