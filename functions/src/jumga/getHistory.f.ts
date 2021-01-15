import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';


const {DATABASE} = require("../helpers/constants");

const getOrders = functions.https.onCall(async (datax, context) => {


  const historyDetails = datax;
  const historyProps = {
      email: historyDetails?.email as string,
      startAt: historyDetails?.startAt || 0 as number,
      limit: historyDetails?.limit || 20 as number
  }
  console.log("Inspecting data object within onSearch: ", historyProps);


  try {

    const db = firestore();
    const orderDB = db.collection(DATABASE.ORDER);
    const query = orderDB.where('email', '==', historyProps.email);
    const doc = await query.get();

    if (doc?.empty) return {};

    const result = [];

    doc?.forEach(doct => {
        const data = doct.data();
        result.push({...data, id: doct.id});
    });

    console.log(result);

    const newResult = result.sort((a,b) => {
      if ( a?.orderDate.toDate() <= b?.orderDate.toDate()) return 1;
      if ( a?.orderDate.toDate() > b?.orderDate.toDate()) return -1;
      return 0;
    })

    const first20Order = {
        totalSize: newResult.length,
        data: newResult.splice(historyProps.startAt, newResult.length <= historyProps.limit? newResult.length : historyProps.limit),
    }
    return first20Order;

  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getOrders;