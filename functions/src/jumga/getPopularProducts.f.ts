import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";


const {DATABASE} = require("../helpers/constants");

const getPopularProducts = functions.https.onCall(async (datax, context) => {


  try {

    const db = firestore();
    const orderDB = db.collection(DATABASE.ORDER);
    const doc = await orderDB.limit(2000).get();

    if (doc?.empty) return {};

    const result = [];

    doc?.forEach(doct => {
        const data = doct.data();
        const x = result.findIndex(item => {
            return item?.productId === data?.productId
        });
        if (x === - 1) {
            result.push({
                productId: data?.productId,
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

    const rep = result.sort((a, b) => {
        if (a?.history.length <= b?.history.length) return 1;
        if (a?.history.length > b?.history.length) return -1;
        return 0;
    });

    console.log(result);

    const first20Customers = {
        totalSize: result.length,
        data: rep.length > 10 ? rep.splice(0, 10) : rep,
    }
    return first20Customers;

  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = getPopularProducts;