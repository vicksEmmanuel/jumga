import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
import * as _ from 'lodash';

const {DATABASE} = require("../helpers/constants");

const getProductList = functions.https.onCall(async (dataX, context) => {

  const productDetails = dataX;
  const productProps = {
      storeId: productDetails?.storeId as string,
      startAt: productDetails?.startAt || 0 as number,
      limit: productDetails?.limit || 10 as number
  }
  console.log("Inspecting data object within onSearch: ", productProps);

  try {
    const db = firestore();
    const storeCollection = db.collection(DATABASE.PRODUCT);
    const query = storeCollection.where('storeId', '==', productProps.storeId);
    const queryData = await query.get();

    if (queryData?.empty) return {};

    const result = [];

    queryData?.forEach(doc => {
        const data = doc.data();
        result.push({
          ...data,
          productId: doc.id
        });
    });

    console.log(result);

    const random100Array = {
        totalSize: result.length,
        data: result.splice(productProps.startAt, result.length <= productProps.limit? result.length : productProps.limit),
    }
    return random100Array;
  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getProductList;