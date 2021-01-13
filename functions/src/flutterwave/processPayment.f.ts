import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
import * as _ from 'lodash';
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

export const getCartPriceBasedOnUser = async (email) => {
  const doc = firestore().collection(DATABASE.CART);
  const docRef = doc.where('email', '==', email);
  const docData = await docRef.get();

  if (docData.empty) throw new Error("Something went wrong");

  const cart = [];
  docData.forEach(i => {
    cart.push({...i.data(), id: i.id});
  });

  if (_.isEmpty(cart)) throw new Error("Something went wrong");

  const total = getTotal(cart);

  return total;
}

export const getAddUpValues = (cart) => {
  let x = 0;
  cart.forEach(item => {
      x += Number(item?.total);
  });
  return x;
}

export const getTotal = (cart) => {
  const discount = getDeliveryCost(cart);
  const totalprice = getAddUpValues(cart);
  return Number(discount) + Number(totalprice);
}

export const getDeliveryCost = (cart) => {
  let delivery = 0;
  cart.forEach(item => {
      delivery += (Number(item?.deliverycost) * item?.quantity);
  })
  return delivery;
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
      paid: false,
      storeId: paymentDetails?.storename || null,
      email: paymentDetails?.email ||  null,
      phone: paymentDetails?.phone || null,
      address: paymentDetails?.address || null,
      country: paymentDetails.country || null,
      state: paymentDetails?.state || null,
      note: paymentDetails?.note || null,
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