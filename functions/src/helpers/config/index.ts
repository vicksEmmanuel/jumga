import * as functions from 'firebase-functions';
import * as _ from "lodash";
// import * as Mixpanel from 'mixpanel';

const admin = require("firebase-admin");
const dotenv = require("dotenv");
// const axios = require("axios");
const hash = require("bcryptjs");
const { auth } = require("firebase/app");

dotenv.config();

const isProduction = functions.config().app.environment.toLowerCase() === 'production';

const CONFIG = (isProduction) ? 
{
  //PRODUCTION config
  
  serviceAccount: require("../../../config/production/jumga-production-firebase-adminsdk-ke3yw-dc1188cac4.json"),
  storageUrl: "https://storage.googleapis.com/jumga-production.appspot.com",
  dbUrl: "https://jumga-production.firebaseio.com",
  defaultBucket: "jumga-production.appspot.com",
  environment: "production",
  raveEndpoint: "https://api.ravepay.co/flwv3-pug/getpaidx/api/charge",
  FWPubKey: "FLWPUBK-270630d3ec19b8aafb4e952c9932c8b9-X",
  FWSecret: "FLWSECK-8029f4652f4a232a4977cffad94a1714-X",
  EncryptionKey: "8029f4652f4aa1503a5e5cb8",
  
}
:
{
  //STAGING config

  serviceAccount: require("../../../config/staging/jumga-staging-firebase-adminsdk-qe7s1-d6c4500330.json"),
  storageUrl: "https://storage.googleapis.com/jumga-staging.appspot.com",
  dbUrl: "https://jumga-staging.firebaseio.com",
  defaultBucket: "jumga-staging.firebaseapp.com",
  environment: "staging",
  raveEndpoint: "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/charge",
  FWPubKey: "FLWPUBK-cba30399325b69565f6c9a752d239000-X",
  FWSecret: "FLWSECK-f2a0b0a192c63cba5f20f6b2c2c37927-X",
  EncryptionKey: "f2a0b0a192c6ee76d1071e80",
}


//FIREBASE DATABASE (FIRESTORE) CONFIG
const RootDocuments = {
  USER: 'users'
}




module.exports = {
  documents: RootDocuments,
  storageBaseUrl: CONFIG.storageUrl,
  dbURL: CONFIG.dbUrl,
  defaultBucket: CONFIG.defaultBucket,
  environment: CONFIG.environment,
  hash,
  serviceAccount: CONFIG.serviceAccount,
  auth,
  admin,
  _,
  raveEndpoint: CONFIG.raveEndpoint,
  FWPubKey: CONFIG.FWPubKey,
  FWSecret: CONFIG.FWSecret,
  EncryptionKey: CONFIG.EncryptionKey
};