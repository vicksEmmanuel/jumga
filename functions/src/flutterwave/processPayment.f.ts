import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
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

const processPayment = functions.https.onCall(async (data, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  }

  const paymentDetails = data;
  console.log("Inspecting data object within processPayment method: ", paymentDetails);
  const rave = new Rave(FWPubKey, FWSecret);

  try {
    const pricey = await rave.getPriceAndCurrency(paymentDetails?.currency, paymentDetails?.currencyPricePerDollar);
    const reference = uuidv4();
    const paymentOptions = {
      tx_ref: reference,
      amount: pricey.storeCost,
      redirect_url: webhook,
      currency: pricey.currency,
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
    };

    if (paymentDetails?.payment_plan) {
      paymentOptions['payment_plan'] = paymentDetails?.payment_plan;
    }

    if (paymentDetails?.productId) {
      paymentOptions.customer['product_id'] = paymentDetails?.productId;
      //TODO: Find price of item add it to paymentOptions.amount
    }

    const result = await rave.initiatePayment(paymentOptions);


    const db = firestore();
    const paymentHolderDB = db.doc(`${DATABASE.PAYMENTHOLDER}/${reference}`);
    await paymentHolderDB.set({
      paymentRef: reference,
      email: paymentDetails?.email,
      amount: pricey.storeCost,
      type: PAYMENTTYPE.STORE,
      storeId: paymentDetails?.storename,
      paid: false,
      createdDate: Date.now()
    });

    console.log("response from successful payment == ", result);
    return result;
  } catch(error) {
    console.log("error occured while attempting to process payment: ", error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }

});

module.exports = processPayment;