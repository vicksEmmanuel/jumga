import * as functions from 'firebase-functions';
import * as _ from "lodash";
import {firestore} from "firebase-admin";
import { v4 as uuidv4 } from 'uuid';
const {DATABASE} = require("../helpers/constants");


export interface DispatchRIder {
    name: string,
    age: number,
    address: string,
    imageUrl: string,
    phoneNumber: string,
    email: string,
    country: string,
    state: string
  }

const onCreateDispatchRiders = functions.https.onRequest(async (req: functions.Request, res: functions.Response <any>) => {

    /**
     * TODO: Make this route accessible to admins
     */

    const body = req?.body;
    const dispatchRider = body?.dispatchRider as DispatchRIder;
    const errorMessage = () => {
        res.status(401).json({
          success: false,
          message: 'No dispatchRider parameter (dispatchRider) provided in body, please provide the categories in the format {name: "",...}',
          error: 'No dispatchRider parameter (dispatchRider) provided in body, please provide the categories in the format {name: "",...}'
        })
      }
    
    const db = firestore();
    const key = uuidv4();
    const dispatchRiderDB = db.doc(`${DATABASE.RIDERS}/${key}`);

    console.log("Categories provided == ", dispatchRider);

    try {

        if (_.isEmpty(dispatchRider)) {
            errorMessage();
            return;
        }


        await dispatchRiderDB.set(dispatchRider);

        res.status(200).json({
            message: 'Dispatch Rider Created. Yay!!'
        });

    } catch (err) {
        console.log(`An Error occurred in categoriesSet `, err);
        res.status(500).json({
            success: false,
            error: err.message
        })
        return;
    }
});

module.exports = onCreateDispatchRiders;