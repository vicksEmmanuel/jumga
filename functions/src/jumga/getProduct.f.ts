import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';


const {DATABASE} = require("../helpers/constants");

const getProduct = functions.https.onCall(async (data, context) => {

  const productId = data.id;
  console.log("Inspecting data object within getProduct method: ", productId);

  try {

    const db = firestore();
    const productDB = db.doc(`${DATABASE.PRODUCT}/${productId}`);
    const doc = await productDB.get();

    if (!doc.exists) return {};

    const storeDB = db.collection(DATABASE.PRODUCT);
    const query = storeDB.where("storeId", '==', doc.data().storeId).limit(5);
    const queryData = await query.get();

    const x = () => {
      const tmp = [];
      queryData.forEach(t => {
        if (t.id !== productId) {
          tmp.push({
            ...t.data(),
            productId: t.id
          });
        }
      });
      return tmp;
    }

    const result = {
      product: doc.data(),
      extraProductFromStore: queryData.empty ? [] : x()
    };

    console.log("response from successful payment == ", result);
    return result;
  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getProduct;