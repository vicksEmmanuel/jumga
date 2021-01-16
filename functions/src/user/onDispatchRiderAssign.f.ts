import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';
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

  const setDispatchRider = (dispatchRide, dispatchRiders) => {
    dispatchRide.forEach(doc => {
      dispatchRiders.push({
        ...doc.data(),
        id: doc.id,
      });
    });
  }

  try {

    const db = admin?.firestore();
    const storeId = context?.params?.storeId;
    const docPath = `${DATABASE.STORE}/${storeId}`

    const canUpdate = (newApprove !== oldApproved) ? true : false ;
    console.log("canUpdate == ", canUpdate)

    if (isOnUpdate && canUpdate){
        if (newApprove === true) {
            const dispatchRiders = db.collection(`${DATABASE.RIDERS}`);
            const dispatchRidersQuery = dispatchRiders.where('state', '==', oldData?.state);
            const getDispatchRiders = await dispatchRidersQuery.get();

            const allDispatchRiders = [];
            setDispatchRider(getDispatchRiders, allDispatchRiders);
           

            if (!(allDispatchRiders.length > 0)) {
                const dispatchRidersQueryCountry = dispatchRiders.where('country', '==', oldData?.country);
                const getDispatchRidersCountry = await dispatchRidersQueryCountry.get();
                setDispatchRider(getDispatchRidersCountry, allDispatchRiders);

                if(!(allDispatchRiders.length > 0)) {
                  const getAllDispatchRiders = await dispatchRiders.get();
                  setDispatchRider(getAllDispatchRiders, allDispatchRiders);
                }
            }

            const randomDispatchRider = _.sampleSize(allDispatchRiders, 1);
            await db.doc(docPath).update({ dispatchRiders: randomDispatchRider[0].id});
            const dispatchers = await db.doc(`${DATABASE.RIDERS}/${randomDispatchRider[0].id}`).get();
            const numOfStores = dispatchers.data()?.numOfStores + 1;
            await db.doc(`${DATABASE.RIDERS}/${randomDispatchRider[0].id}`).update({numOfStores});

        } else {
            if (!_.isNull(oldData.dispatchRiders)) {
              const dispatchers = await db.doc(`${DATABASE.RIDERS}/${oldData.dispatchRiders}`).get();
              const numOfStores = dispatchers.data()?.numOfStores - 1;
              await db.doc(`${DATABASE.RIDERS}/${oldData.dispatchRiders}`).update({numOfStores});
            }
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