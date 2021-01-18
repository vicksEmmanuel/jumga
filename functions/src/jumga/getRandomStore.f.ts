import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";


const {DATABASE} = require("../helpers/constants");

const getRandomStores = functions.https.onCall(async (data, context) => {

  try {

    const db = firestore();
    const storeDB = db.collection(`${DATABASE.STORE}`);
    const doc = await storeDB.limit(10).get();

    if (!doc.empty) return [];

    const tmp = [];

    doc.forEach(t => {
        tmp.push({...t.data(), productId: t.id});
    })

    return tmp;
  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getRandomStores;