// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// const admin = require("firebase-admin");
// const firebase = require("firebase");
// const functions = require("firebase-functions");
// const { Logging } = require('@google-cloud/logging');

// const logging = new Logging();

// const { FIREBASE_PROD, FIREBASE_STAGING } = require("./src/helpers/constants");

// const serviceAccount = functions.config().app.environment.toLowerCase() === 'production' ? FIREBASE_PROD : FIREBASE_STAGING;

// try {
//   admin.initializeApp(serviceAccount);
//   firebase.initializeApp(serviceAccount);
// }
// catch (e) {
//   console.log("whoops! there's been an error", e);
// }

// ("use strict");
// /** EXPORT ALL FUNCTIONS
//  *
//  *   Loads all `.f.js OR .f.ts` files
//  *   Exports a cloud function matching the file name
//  *   Author: David King
//  *   Edited: Tarik Huber
//  *   Based on this thread:
//  *     https://github.com/firebase/functions-samples/issues/170
//  */
// const glob = require("glob");
// const camelCase = require("camelcase");
// const files = glob.sync("./**/*.f.ts", {
//   cwd: __dirname,
//   ignore: "./node_modules/**"
// });

// for (let f = 0, fl = files.length; f < fl; f++) {
//   const file = files[f];
//   const functionName = camelCase(
//     file
//       .slice(5, -5)
//       .split("/")
//       .join("_")
//   ); // Strip off '.f.js OR .f.ts'
  
//   if (
//     !process.env.FUNCTION_NAME ||
//     process.env.FUNCTION_NAME === functionName
//   ) {
//     exports[functionName] = require(file);
//   }
// }
