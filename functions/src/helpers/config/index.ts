import * as functions from 'firebase-functions';
import * as _ from "lodash";
import * as Mixpanel from 'mixpanel';

const admin = require("firebase-admin");
const dotenv = require("dotenv");
const axios = require("axios");
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
  environment: "production"
}
:
{
  //STAGING config

  serviceAccount: require("../../../config/staging/jumga-staging-firebase-adminsdk-qe7s1-d6c4500330.json"),
  storageUrl: "https://storage.googleapis.com/jumga-staging.appspot.com",
  dbUrl: "https://jumga-staging.firebaseio.com",
  defaultBucket: "jumga-staging.firebaseapp.com",
  environment: "staging"
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
  _
};