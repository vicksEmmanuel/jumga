import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
const moment = require('moment');
// const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';

import { v4 as uuidv4 } from 'uuid';

const Rave = require('./Rave');
const { FWPubKey, FWSecret, jumgaLogo, webhook } = require("../helpers/config");
const {DATABASE, PAYMENTTYPE} = require("../helpers/constants");

// TODO: Retrieve cost and currency using remoteConfig
// const getRemoteConfig = async () => {
//   const config = admin.remoteConfig();
//   return await config.getTemplate();
// }

const getCartPriceBasedOnUser = async (email) => {
  return 0;
}


const processPayment = functions.https.onCall(async (data, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  }

  const paymentDetails = data;
  console.log("Inspecting data object within processPayment method: ", paymentDetails);
  const rave = new Rave(FWPubKey, FWSecret);

  try {
    const reference = uuidv4();
    const paymentOptions = {
      tx_ref: reference,
      redirect_url: webhook,
      payment_options: 'card',
      customer: {
        email: paymentDetails?.email,
        name: paymentDetails?.name,
        store_id: paymentDetails?.storename,
      },
      customization: {
        title: paymentDetails?.paymentTitle,
        description: paymentDetails?.description,
        logo: jumgaLogo,
      },
      amount: 0,
      type: PAYMENTTYPE.STORE
    };

    if (paymentDetails?.payment_plan) {
      paymentOptions['payment_plan'] = paymentDetails?.payment_plan;
    }

    if (paymentDetails?.sell) {
      const totalCartPrice = await getCartPriceBasedOnUser(paymentDetails?.email);
      const pricey = await rave.getTotalCostOfCart(paymentDetails?.currency, paymentDetails?.currencyPricePerDollar, totalCartPrice); 
      paymentOptions['amount']  = pricey.cost;
      paymentOptions['currency'] =  pricey.currency;
      paymentOptions['type'] = PAYMENTTYPE.PRODUCT;
    } else {
      const pricey = await rave.getPriceAndCurrency(paymentDetails?.currency, paymentDetails?.currencyPricePerDollar);
      paymentOptions['amount']  = pricey.cost;
      paymentOptions['currency'] =  pricey.currency;
      paymentOptions['type'] = PAYMENTTYPE.STORE;
    }

    const result = await rave.initiatePayment(paymentOptions);


    const db = firestore();
    const paymentHolderDB = db.doc(`${DATABASE.PAYMENTHOLDER}/${reference}`);

    await paymentHolderDB.set({
      paymentRef: reference,
      email: paymentDetails?.email,
      paid: false,
      storeId: paymentDetails?.storename,
      amount: paymentOptions?.amount,
      type: paymentOptions?.type,
      createdDate: firestore.Timestamp.fromDate(moment().toDate()),
    });

    console.log("response from successful payment == ", result);
    return {...result, reference};
  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = processPayment;