import * as functions from 'firebase-functions';
import * as _ from "lodash";

const admin = require("firebase-admin");
// const axios = require("axios");
const { auth } = require("firebase/app");

// dotenv.config();

const isProduction = functions.config().app.environment.toLowerCase() === 'production';

const prodConfig = {
    apiKey: "AIzaSyAivQGmPrtBdCmrSCJ0T6MAYhsCdW4JD_I",
    authDomain: "jumga-production.firebaseapp.com",
    projectId: "jumga-production",
    storageBucket: "jumga-production.appspot.com",
    messagingSenderId: "709179712620",
    databaseURL: "https://jumga-production.firebaseio.com",
    appId: "1:709179712620:web:887e7e0ce6b5c158a42449",
    measurementId: "G-SMD1S5YJCM"
}

const stagingConfig = {
  apiKey: "AIzaSyBkBHhCZD9gPxsnnJ7kxCFACSi1fqGVDkk",
  authDomain: "jumga-staging.firebaseapp.com",
  projectId: "jumga-staging",
  storageBucket: "jumga-staging.appspot.com",
  messagingSenderId: "794279648514",
  appId: "1:794279648514:web:77176bc83a77c3a0b3361b",
  measurementId: "G-091BK5DQBX",
  databaseURL: "https://jumga-staging.firebaseio.com",
}

module.exports = {
  FIREBASE_PROD: prodConfig,
  FIREBASE_STAGING: stagingConfig,
  HASH_STRENGTH: 10,
  apiKey: process.env.AT_API_KEY,
  dbURL: (isProduction) ? prodConfig.databaseURL : prodConfig.databaseURL,
  defaultBucket: (isProduction) ? prodConfig.storageBucket : stagingConfig.storageBucket,
  environment: (isProduction) ? "production" : "staging",
  auth,
  admin,
  _,
  DATABASE: {
    USER: 'users',
    CATEGORY: 'categories',
    STORE: 'stores',
    PAYMENTHOLDER: 'paymentHolder',
    PRODUCT: 'products',
    RIDERS: 'dispatchRiders'
  },
  PAYMENTTYPE: {
    STORE: 'STORE',
    PRODUCT: 'PRODUCT'
  }
};
