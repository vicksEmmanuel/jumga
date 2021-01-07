import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import * as moment from 'moment';

const {DATABASE} = require("../helpers/constants");


const userOnUpdate = functions.firestore.document(`${DATABASE.STORE}/{storeId}`).onWrite(async (change, context) => {
  
  const isOnCreate = !change?.before?.exists && change?.after?.exists;
  const isOnUpdate = change?.before?.exists && change?.after?.exists;

  console.log("isOnCreate == ", isOnCreate)
  console.log("isOnUpdate == ", isOnUpdate)

  const oldData = change?.before?.data()
  const newData = change?.after?.data()

  // console.log("oldData == ", oldData)
  // console.log("newData == ", newData)

  const oldApproved = oldData?.approved;
  const { approved: newApprove } = newData;

  try {

    const db = admin?.firestore();
    const storeId = context?.params?.storeId;
    const docPath = `${DATABASE.STORE}/${storeId}`

    const canUpdate = (newApprove !== oldApproved) ? false : true ;
    console.log("canUpdate == ", canUpdate)

    if (isOnUpdate && canUpdate){
        if (newApprove === true) {
            console.log("here");
        } else {
            await db.doc(docPath).update({ dispatchRiders: null})
        }
    }

  }
  catch (error) {
    console.log("error from updating user update_at entry == ", error)
  }

  return true;

})

module.exports = userOnUpdate;