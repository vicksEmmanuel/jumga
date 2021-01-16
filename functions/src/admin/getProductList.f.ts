import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';


const {DATABASE} = require("../helpers/constants");

const getStores = functions.https.onCall(async (datax, context) => {


  const productDetails = datax;
  const productProps = {
      startAt: productDetails?.startAt || 0 as number,
      limit: productDetails?.limit || 20 as number
  }
  console.log("Inspecting data object within onSearch: ", productProps);


  try {

    const db = firestore();
    const productDB = db.collection(DATABASE.PRODUCT);
    const doc = await productDB.get();

    if (doc?.empty) return {};

    const result = [];

    doc?.forEach(doct => {
        const data = doct.data();
        result.push({...data, id: doct.id});
    });

    console.log(result);

    const newResult = result.sort((a,b) => {
      if ( a?.createdAt.toDate() <= b?.createdAt.toDate()) return 1;
      if ( a?.createdAt.toDate() > b?.createdAt.toDate()) return -1;
      return 0;
    })

    const first20Order = {
        totalSize: newResult.length,
        data: newResult.splice(productProps.startAt, newResult.length <= productProps.limit? newResult.length : productProps.limit),
    }
    return first20Order;

  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getStores;