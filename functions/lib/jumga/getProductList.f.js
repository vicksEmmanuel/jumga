"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const { DATABASE } = require("../helpers/constants");
const getProductList = functions.https.onCall(async (dataX, context) => {
    const productDetails = dataX;
    const productProps = {
        storeId: productDetails === null || productDetails === void 0 ? void 0 : productDetails.storeId,
        startAt: (productDetails === null || productDetails === void 0 ? void 0 : productDetails.startAt) || 0,
        limit: (productDetails === null || productDetails === void 0 ? void 0 : productDetails.limit) || 10
    };
    console.log("Inspecting data object within onSearch: ", productProps);
    try {
        const db = firebase_admin_1.firestore();
        const storeCollection = db.collection(DATABASE.PRODUCT);
        const query = storeCollection.where('storeId', '==', productProps.storeId);
        const queryData = await query.get();
        if (queryData === null || queryData === void 0 ? void 0 : queryData.empty)
            return {};
        const result = [];
        queryData === null || queryData === void 0 ? void 0 : queryData.forEach(doc => {
            const data = doc.data();
            result.push(Object.assign(Object.assign({}, data), { productId: doc.id }));
        });
        console.log(result);
        const random100Array = {
            totalSize: result.length,
            data: result.splice(productProps.startAt, result.length <= productProps.limit ? result.length : productProps.limit),
        };
        return random100Array;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = getProductList;
//# sourceMappingURL=getProductList.f.js.map