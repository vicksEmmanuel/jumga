import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
import * as _ from 'lodash';

const {DATABASE} = require("../helpers/constants");

const onSearch = functions.https.onCall(async (dataX, context) => {

  const searchDetails = dataX;
  console.log("Inspecting data object within onSearch: ", searchDetails);

  try {

    const searchProps = {
        searchId: searchDetails?.id || '' as string,
        filter: searchDetails?.filter || true as boolean,
        filterPriceMinRange: searchDetails?.filterPriceMinRange || 0 as number,
        filterPriceMaxRange: searchDetails?.filterPriceMaxRange || 1000000000 as number,
        filterDiscountRate: searchDetails?.filterDiscountRate || 90 as number,
        filterCustomerRating: searchDetails?.filterCustomerRating || 5 as number,
        startAt: searchDetails?.startAt || 0 as number,
        limit: searchDetails?.limit || 10 as number,
    }


    const db = firestore();
    const storeCollection = db.collection(DATABASE.PRODUCT);
    const queryData = await storeCollection.get();

    if (queryData?.empty) return {};

    const result = [];

    queryData?.forEach(doc => {
        const data = doc.data();
        const categories = data.categories.map(i => String(i).toLowerCase()).toString();
        const searchString = String(searchProps.searchId).toLowerCase();

        if (searchProps.filter) {
            if (
                (data.starRating <= searchProps.filterCustomerRating) && //Chec customer ratings
                //TODO: Discount Rating 
                ((data.currentprice <= searchProps.filterPriceMaxRange) && (searchProps.filterPriceMinRange <= data.currentprice)) &&

                (

                    categories.match(searchString) !== null
                )
            ) {
                result.push({
                    ...data,
                    productId: doc.id
                });
            }
        } else {
            if  (
                categories.match(searchString) !== null
            )   {
                result.push({
                    ...data,
                    productId: doc.id
                });
            }
        }
    });

    const random100Array = {
        totalSize: result.length,
        data: result.splice(searchProps.startAt, result.length <= searchProps.limit? result.length : searchProps.limit),
    }
    return random100Array;
  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = onSearch;