import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';


const {DATABASE} = require("../helpers/constants");

const getCustomers = functions.https.onCall(async (datax, context) => {


  const orderDetails = datax;
  const orderProps = {
      storeId: orderDetails?.storeId as string,
      startAt: orderDetails?.startAt || 0 as number,
      limit: orderDetails?.limit || 20 as number
  }
  console.log("Inspecting data object within onSearch: ", orderProps);


  try {

    const db = firestore();
    const orderDB = db.collection(DATABASE.ORDER);
    const query = orderDB.where('storeId', '==', orderProps.storeId);
    const doc = await query.get();

    if (doc?.empty) return {};

    const result = [];

    doc?.forEach(doct => {
        const data = doct.data();
        const x = result.findIndex(item => {
            return item?.customer === data?.email
        });
        if (x === - 1) {
            result.push({
                customer: data?.email,
                history: [{...data}]
            });
        } else {
            const history = result[x].history;
            history.push({...data});
            history.sort((a,b) => {
                if ( a?.orderDate.toDate() <= b?.orderDate.toDate()) return 1;
                if ( a?.orderDate.toDate() > b?.orderDate.toDate()) return -1;
                return 0;
            });
            result[x] = {...result[x], history};
        }
    });

    console.log(result);

    const first20Customers = {
        totalSize: result.length,
        data: result.splice(orderProps.startAt, result.length <= orderProps.limit? result.length : orderProps.limit),
    }
    return first20Customers;

  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getCustomers;