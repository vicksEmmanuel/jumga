import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import * as _ from 'lodash';

const moment = require('moment');
const db = firestore();
const {DATABASE} = require("../helpers/constants");

const scheduledFunction = functions.pubsub.schedule('every 72 hours').onRun(async (context) => {
    console.log('This function will be run every 72 hours!');
    
    const batch = db.batch();
    const paymentHolderDB = db.collection(`${DATABASE.PAYMENTHOLDER}`);
    const todaysMoment = moment(Date.now());
    console.log("Todays Moment == ", todaysMoment.toDate());
    const query = paymentHolderDB.where('createdDate', '<=', todaysMoment.toDate()).limit(400);
    const docs = await query.get();
  
    if (docs.empty) {
        return null;
    }
  
    docs.forEach(doc => {
      console.log("There and ther");
      console.log(doc.data())
      if (todaysMoment.diff(moment(doc.data().createdDate.toDate()), 'days') > 2 ) {
        batch.delete(doc.ref);
      }      
    });
  
    await batch.commit();
    
  
    return null;
  });
  
  
  module.exports = scheduledFunction;