import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';


const {DATABASE} = require("../helpers/constants");

const getCustomers = functions.https.onCall(async (datax, context) => {


  const userDetails = datax;
  const userProps = {
      startAt: userDetails?.startAt || 0 as number,
      limit: userDetails?.limit || 20 as number
  }
  console.log("Inspecting data object within onSearch: ", userProps);


  try {

    const db = firestore();
    const userDB = db.collection(DATABASE.USER);
    const doc = await userDB.get();

    if (doc?.empty) return {};

    const result = [];

    doc?.forEach(doct => {
        const data = doct.data();
        result.push({...data, id: doct.id});
    });

    console.log(result);

    const first20Customers = {
        totalSize: result.length,
        data: result.splice(userProps.startAt, result.length <= userProps.limit? result.length : userProps.limit),
    }
    return first20Customers;

  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getCustomers;