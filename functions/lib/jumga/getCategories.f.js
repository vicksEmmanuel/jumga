"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const { DATABASE } = require("../helpers/constants");
const onSearch = functions.https.onCall(async (dataX, context) => {
    const searchDetails = dataX;
    console.log("Inspecting data object within onSearch: ", searchDetails);
    try {
        const searchProps = {
            searchId: (searchDetails === null || searchDetails === void 0 ? void 0 : searchDetails.id) || '',
            filter: (searchDetails === null || searchDetails === void 0 ? void 0 : searchDetails.filter) || true,
            filterPriceMinRange: (searchDetails === null || searchDetails === void 0 ? void 0 : searchDetails.filterPriceMinRange) || 0,
            filterPriceMaxRange: (searchDetails === null || searchDetails === void 0 ? void 0 : searchDetails.filterPriceMaxRange) || 1000000000,
            filterDiscountRate: (searchDetails === null || searchDetails === void 0 ? void 0 : searchDetails.filterDiscountRate) || 90,
            filterCustomerRating: (searchDetails === null || searchDetails === void 0 ? void 0 : searchDetails.filterCustomerRating) || 5,
            startAt: (searchDetails === null || searchDetails === void 0 ? void 0 : searchDetails.startAt) || 0,
            limit: (searchDetails === null || searchDetails === void 0 ? void 0 : searchDetails.limit) || 10,
        };
        const db = firebase_admin_1.firestore();
        const storeCollection = db.collection(DATABASE.PRODUCT);
        const queryData = await storeCollection.get();
        if (queryData === null || queryData === void 0 ? void 0 : queryData.empty)
            return {};
        const result = [];
        queryData === null || queryData === void 0 ? void 0 : queryData.forEach(doc => {
            const data = doc.data();
            const categories = data.categories.map(i => String(i).toLowerCase()).toString();
            const searchString = String(searchProps.searchId).toLowerCase();
            if (searchProps.filter) {
                if ((data.starRating <= searchProps.filterCustomerRating) && //Chec customer ratings
                    //TODO: Discount Rating 
                    ((data.currentprice <= searchProps.filterPriceMaxRange) && (searchProps.filterPriceMinRange <= data.currentprice)) &&
                    (categories.match(searchString) !== null)) {
                    result.push(Object.assign(Object.assign({}, data), { productId: doc.id }));
                }
            }
            else {
                if (categories.match(searchString) !== null) {
                    result.push(Object.assign(Object.assign({}, data), { productId: doc.id }));
                }
            }
        });
        const random100Array = {
            totalSize: result.length,
            data: result.splice(searchProps.startAt, result.length <= searchProps.limit ? result.length : searchProps.limit),
        };
        return random100Array;
    }
    catch (error) {
        console.log("error occured while attempting to process payment: ", error);
        throw new functions.https.HttpsError('unknown', error.message, error);
    }
});
module.exports = onSearch;
//# sourceMappingURL=getCategories.f.js.map