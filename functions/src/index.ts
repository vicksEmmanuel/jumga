// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import * as _ from 'lodash';
const firebase = require("firebase");
const glob = require("glob");
const camelCase = require("camelcase");

const { FIREBASE_PROD, FIREBASE_STAGING } = require("./helpers/constants");
const { serviceAccount } = require('./helpers/config');

const config = functions.config().app.environment.toLowerCase() === 'production' ? FIREBASE_PROD : FIREBASE_STAGING;

try {

  // console.log("FIREBASE_PROD == ", mxpAPISecret);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: config.storageBucket
  });
  firebase.initializeApp(config);
  // console.log("Config Obj == ", Config);

  ("use strict");

  const files = glob.sync("./**/*.f.{js,ts}", {
    cwd: __dirname,
    ignore: "../node_modules/**"
  });

  console.log("files being loaded == ", files)

  for (let f = 0, fl = files.length; f < fl; f++) {
    const file = files[f];
    const preCamCasePath = _.compact(file.split('.'))[0] as string
    const functionName = camelCase(preCamCasePath.replace(/\//g, "_")); // Strip off '.f.js OR .f.ts'
    
    if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName) {
      // console.log(`functionName ${functionName} == `, file)
      exports[functionName] = require(file);
    }
  }
}
catch (e) {
  console.log("whoops! there's been an error", e);
}

