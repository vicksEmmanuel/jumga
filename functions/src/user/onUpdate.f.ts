import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import * as moment from 'moment';

const { documents } = require('../helpers/config');

const userOnUpdate = functions.firestore.document(`${documents.USER}/{userId}`).onWrite(async (change, context) => {
  
  const isOnCreate = !change?.before?.exists && change?.after?.exists;
  const isOnUpdate = change?.before?.exists && change?.after?.exists;

  console.log("isOnCreate == ", isOnCreate)
  console.log("isOnUpdate == ", isOnUpdate)

  const oldData = change?.before?.data()
  const newData = change?.after?.data()

  // console.log("oldData == ", oldData)
  // console.log("newData == ", newData)

  const oldUpdatedAt = oldData?.updated_at;
  const { updated_at: newUpdatedAt } = newData;

  try {

    const db = admin?.firestore();
    const userId = context?.params?.userId;
    const docPath = `${documents.USER}/${userId}`

    const canUpdate = (newUpdatedAt?._seconds !== oldUpdatedAt?._seconds) ? false : true;
    console.log("canUpdate == ", canUpdate)

    if (isOnCreate) {
      await db.doc(docPath).update({ updated_at: new Date()})
    }
    else if (isOnUpdate && canUpdate){
      await db.doc(docPath).update({ updated_at: new Date()})
    }

  }
  catch (error) {
    console.log("error from updating user update_at entry == ", error)
  }

  return true;

})

module.exports = userOnUpdate;