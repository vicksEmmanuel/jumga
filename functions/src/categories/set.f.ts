import * as functions from 'firebase-functions';
import * as _ from "lodash";
import {firestore} from "firebase-admin";
const {DATABASE} = require("../helpers/constants");


const onSetProductCategories = functions.https.onRequest(async (req: functions.Request, res: functions.Response <any>) => {

    /**
     * TODO: Make this route accessible to admins
     */

    const body = req?.body;
    const categories = body?.categories as object;
    const errorMessage = () => {
        res.status(401).json({
          success: false,
          message: 'No category parameter (categories) provided in body, please provide the categories in the format {BabyProduct: [shoes,cloth, ...]}',
          error: 'No category parameter (categories) provided in body, please provide the categories in the format {BabyProduct: [shoes,cloth, ...]}'
        })
      }
    
    const db = firestore();
    const categoriesDB = db.collection(DATABASE.CATEGORY);

    console.log("Categories provided == ", categories);

    try {

        if (_.isEmpty(categories)) {
            errorMessage();
            return;
        }

        await db.runTransaction(async (t) => {
            await Promise.all(
                Object.keys(categories).map(el => {
                    const docRef = categoriesDB.doc(el);
                    // const docData = await t.get(docRef);
                    t.set(docRef, {...categories[el]});
                })
            )
        });

        res.status(200).json({
            message: 'Categories set. Yay!!'
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

module.exports = onSetProductCategories;