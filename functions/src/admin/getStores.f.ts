import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';


const {DATABASE} = require("../helpers/constants");

const getStores = functions.https.onCall(async (datax, context) => {


  const storeDetails = datax;
  const storeProps = {
      startAt: storeDetails?.startAt || 0 as number,
      limit: storeDetails?.limit || 20 as number
  }
  console.log("Inspecting data object within onSearch: ", storeProps);


  try {

    const db = firestore();
    const storeDB = db.collection(DATABASE.STORE);
    const doc = await storeDB.get();

    if (doc?.empty) return {};

    const result = [];

    doc?.forEach(doct => {
        const data = doct.data();
        result.push({...data, id: doct.id});
    });

    console.log(result);

    const newResult = result.sort((a,b) => {
      if ( a?.createdDate.toDate() <= b?.createdDate.toDate()) return 1;
      if ( a?.createdDate.toDate() > b?.createdDate.toDate()) return -1;
      return 0;
    })

    const first20Order = {
        totalSize: newResult.length,
        data: newResult.splice(storeProps.startAt, newResult.length <= storeProps.limit? newResult.length : storeProps.limit),
    }
    return first20Order;

  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getStores;