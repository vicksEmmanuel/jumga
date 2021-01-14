import * as functions from 'firebase-functions';
import {firestore} from "firebase-admin";
import * as _ from 'lodash';
const {DATABASE} = require("../helpers/constants");

const db = firestore();
const getYearTemplate = () => {
  const years = {};
  [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].forEach(id => {
    years[`${id}`] = { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sept: 0, oct: 0, nov: 0, dec: 0};
  });
  return years;
}

const retrieveAllDocumentsInCollction = (collectionName, store) => {
    return new Promise(async (resolve, reject) => {
        const doc = db.collection(collectionName);
        const query = doc.where('storeId', '==', store);
        const docData = await query.get();
        resolve(docData);
    });
}
const determineWhatMonth = (dateJoined, yearToAdd, userJoiningHolder) => {
  switch (dateJoined) {
    case 1 : 
      userJoiningHolder[yearToAdd].jan += 1;
      break;
    case 2 :
      userJoiningHolder[yearToAdd].feb += 1;
      break;
    case 3 :
      userJoiningHolder[yearToAdd].mar += 1;
      break;
    case 4 :
      userJoiningHolder[yearToAdd].apr += 1;
      break;
    case 5 :
      userJoiningHolder[yearToAdd].may += 1;
      break;
    case 6 :
      userJoiningHolder[yearToAdd].jun += 1;
      break;
    case 7 :
      userJoiningHolder[yearToAdd].jul += 1;
      break;
    case 8 :
      userJoiningHolder[yearToAdd].aug += 1;
      break;
    case 9 :
      userJoiningHolder[yearToAdd].sept += 1;
      break;
    case 10 :
      userJoiningHolder[yearToAdd].oct += 1;
      break;
    case 11 :
      userJoiningHolder[yearToAdd].nov += 1;
      break;
    case 12 :
      userJoiningHolder[yearToAdd].dec += 1;
      break;
    default:
      break;
  }
}

const determineWhatRevenueMonth = (dateJoined, yearToAdd, userJoiningHolder, amount) => {
    switch (dateJoined) {
      case 1 : 
        userJoiningHolder[yearToAdd].jan += amount;
        break;
      case 2 :
        userJoiningHolder[yearToAdd].feb += amount;
        break;
      case 3 :
        userJoiningHolder[yearToAdd].mar += amount;
        break;
      case 4 :
        userJoiningHolder[yearToAdd].apr += amount;
        break;
      case 5 :
        userJoiningHolder[yearToAdd].may += amount;
        break;
      case 6 :
        userJoiningHolder[yearToAdd].jun += amount;
        break;
      case 7 :
        userJoiningHolder[yearToAdd].jul += amount;
        break;
      case 8 :
        userJoiningHolder[yearToAdd].aug += amount;
        break;
      case 9 :
        userJoiningHolder[yearToAdd].sept += amount;
        break;
      case 10 :
        userJoiningHolder[yearToAdd].oct += amount;
        break;
      case 11 :
        userJoiningHolder[yearToAdd].nov += amount;
        break;
      case 12 :
        userJoiningHolder[yearToAdd].dec += amount;
        break;
      default:
        break;
    }
  }

const getOrderStat = async (data) => {
    const { storeId } = data;
    const orderSnapshot = await retrieveAllDocumentsInCollction(DATABASE.ORDER, storeId) as firestore.QuerySnapshot<firestore.DocumentData>;
    const ordersPerMonth  = getYearTemplate();
    orderSnapshot.forEach(doc => {
      const orderDate = new Date(doc.data().orderDate.toDate());
      const getYear = `${orderDate.getFullYear()}`;
      determineWhatMonth(orderDate.getMonth() + 1, getYear, ordersPerMonth);
    });
    return {
      numberOfOrders: orderSnapshot.size? orderSnapshot.size : 0,
      numOfOrdersPerMonth: ordersPerMonth
    };
}

const getRevenueStat = async (data) => {
    const { storeId } = data;
    const revenueSnapshot = await retrieveAllDocumentsInCollction(DATABASE.ORDER, storeId) as firestore.QuerySnapshot<firestore.DocumentData>;
    const revenuePerMonth = getYearTemplate();

    revenueSnapshot.forEach(doc => {
        const orderDate = new Date(doc.data().orderDate.toDate());
        const getYear = `${orderDate.getFullYear()}`;
        determineWhatRevenueMonth(orderDate.getMonth() + 1, getYear, revenuePerMonth, Number(doc.data()?.totalCostOfSales));
    });

    return {
        revenuePerMonth
    };
}

const getDeliveryGuy = async (data) => {
    const { storeId } = data;
    const doc = db.doc(`${DATABASE.STORE}/${storeId}`);
    const docData = await doc.get();

    const delivery = docData.data()?.dispatchRiders;
    const deliveryDB = db.doc(`${DATABASE.RIDERS}/${delivery}`);
    const deliveryDoc = await deliveryDB.get();
    if (!deliveryDoc.exists) return {
        deliveryGuy: {}
    }
    return {
        deliveryGuy : deliveryDoc.data()
    }
}

const getUserStatistics = async (data) => {
    const { numberOfOrders, numOfOrdersPerMonth } = await getOrderStat(data);
    const { revenuePerMonth } = await getRevenueStat(data);
    const { deliveryGuy } = await getDeliveryGuy(data);

    return {
        numberOfOrders, 
        numOfOrdersPerMonth,
        revenuePerMonth,
        deliveryGuy
    }
}


module.exports = functions.https.onCall(async (data, context) => {
    const statistics = await getUserStatistics(data);
    return {
      statistics
    };
});