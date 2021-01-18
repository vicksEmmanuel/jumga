import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
const moment = require('moment');


const {DATABASE} = require("../helpers/constants");

const processDelivery = functions.https.onCall(async (datax, context) => {


  const orderDetails = datax;
  const orderProps = {
      id: orderDetails?.id as string
  }
  console.log("Inspecting data object within onSearch: ", orderProps);


  try {

    const db = firestore();
    const orderDB = db.collection(DATABASE.ORDER);
    const storeDB = db.collection(DATABASE.STORE);
    const dispatchRidersDB = db.collection(DATABASE.RIDERS);
    const jumgaDB = db.collection(DATABASE.JUMGA);

    await db.runTransaction(async (t) => {
        const orderToGet = orderDB.doc(orderProps.id);
        const order = await t.get(orderToGet);

        const storeToGet = storeDB.doc(order.data()?.storeId);
        const store = await t.get(storeToGet);

        const dispatchRidersToGet = dispatchRidersDB.doc(store.data()?.dispatchRiders);
        const dispatchRiders = await t.get(dispatchRidersToGet);

        await t.update(orderToGet, {isDelivered: true});

        const newStorePendingBalance = Number(store.data()?.pendingBalance) - Number(order.data()?.totalCostOfSales);
        const newRevenue = Number(store.data()?.walletBalance) + Number(order.data()?.totalCostOfSales);

        await t.update(storeToGet, {
            pendingBalance: newStorePendingBalance,
            walletBalance: newRevenue
        });

        const newDeliveryWalletBalance = Number(dispatchRiders.data()?.walletBalance) + Number(order.data()?.totalCostOfDelivery);
        await t.update(dispatchRidersToGet, {
            walletBalance: newDeliveryWalletBalance
        });

        await t.set(jumgaDB.doc(), {
            commissionFromSales: order.data()?.totalCostOfCommissionOnSales,
            commissionFromDelivery: order.data()?.totalcostOfCommissionOnDelivery,
            createdDate: firestore.Timestamp.fromDate(moment().toDate())
        });
    });

  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = processDelivery;