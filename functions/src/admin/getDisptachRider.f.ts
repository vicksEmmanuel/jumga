import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';


const {DATABASE} = require("../helpers/constants");

const getOrders = functions.https.onCall(async (datax, context) => {


  const orderDetails = datax;
  const orderProps = {
      startAt: orderDetails?.startAt || 0 as number,
      limit: orderDetails?.limit || 20 as number
  }
  console.log("Inspecting data object within onSearch: ", orderProps);


  try {

    const db = firestore();
    const orderDB = db.collection(DATABASE.RIDERS);
    const doc = await orderDB.get();

    if (doc?.empty) return {};

    const result = [];

    doc?.forEach(doct => {
        const data = doct.data();
        result.push({...data, id: doct.id});
    });

    console.log(result);

    const newResult = result.sort((a,b) => {
      if ( a?.numOfStores <= b?.numOfStores) return 1;
      if ( a?.numOfStores > b?.numOfStores) return -1;
      return 0;
    })

    const first20Order = {
        totalSize: newResult.length,
        data: newResult.splice(orderProps.startAt, newResult.length <= orderProps.limit? newResult.length : orderProps.limit),
    }
    return first20Order;

  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getOrders;