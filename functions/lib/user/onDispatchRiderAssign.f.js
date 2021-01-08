"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const _ = require("lodash");
// import * as moment from 'moment';
const { DATABASE } = require("../helpers/constants");
const userOnUpdate = functions.firestore.document(`${DATABASE.STORE}/{storeId}`).onWrite(async (change, context) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const isOnCreate = !((_a = change === null || change === void 0 ? void 0 : change.before) === null || _a === void 0 ? void 0 : _a.exists) && ((_b = change === null || change === void 0 ? void 0 : change.after) === null || _b === void 0 ? void 0 : _b.exists);
    const isOnUpdate = ((_c = change === null || change === void 0 ? void 0 : change.before) === null || _c === void 0 ? void 0 : _c.exists) && ((_d = change === null || change === void 0 ? void 0 : change.after) === null || _d === void 0 ? void 0 : _d.exists);
    console.log("isOnCreate == ", isOnCreate);
    console.log("isOnUpdate == ", isOnUpdate);
    const oldData = (_e = change === null || change === void 0 ? void 0 : change.before) === null || _e === void 0 ? void 0 : _e.data();
    const newData = (_f = change === null || change === void 0 ? void 0 : change.after) === null || _f === void 0 ? void 0 : _f.data();
    // console.log("oldData == ", oldData)
    // console.log("newData == ", newData)
    const oldApproved = oldData === null || oldData === void 0 ? void 0 : oldData.approved;
    const { approved: newApprove } = newData;
    const setDispatchRider = (dispatchRide, dispatchRiders) => {
        dispatchRide.forEach(doc => {
            dispatchRiders.push(Object.assign(Object.assign({}, doc.data()), { id: doc.id }));
        });
    };
    try {
        const db = admin === null || admin === void 0 ? void 0 : admin.firestore();
        const storeId = (_g = context === null || context === void 0 ? void 0 : context.params) === null || _g === void 0 ? void 0 : _g.storeId;
        const docPath = `${DATABASE.STORE}/${storeId}`;
        const canUpdate = (newApprove !== oldApproved) ? true : false;
        console.log("canUpdate == ", canUpdate);
        if (isOnUpdate && canUpdate) {
            if (newApprove === true) {
                const dispatchRiders = db.collection(`${DATABASE.RIDERS}`);
                const dispatchRidersQuery = dispatchRiders.where('state', '==', oldData === null || oldData === void 0 ? void 0 : oldData.state);
                const getDispatchRiders = await dispatchRidersQuery.get();
                const allDispatchRiders = [];
                setDispatchRider(getDispatchRiders, allDispatchRiders);
                if (!(allDispatchRiders.length > 0)) {
                    const dispatchRidersQueryCountry = dispatchRiders.where('country', '==', oldData === null || oldData === void 0 ? void 0 : oldData.country);
                    const getDispatchRidersCountry = await dispatchRidersQueryCountry.get();
                    setDispatchRider(getDispatchRidersCountry, allDispatchRiders);
                    if (!(allDispatchRiders.length > 0)) {
                        const getAllDispatchRiders = await dispatchRiders.get();
                        setDispatchRider(getAllDispatchRiders, allDispatchRiders);
                    }
                }
                const randomDispatchRider = _.sampleSize(allDispatchRiders, 1);
                await db.doc(docPath).update({ dispatchRiders: randomDispatchRider[0].id });
            }
            else {
                await db.doc(docPath).update({ dispatchRiders: null });
            }
        }
    }
    catch (error) {
        console.log("error from updating user update_at entry == ", error);
    }
    return true;
});
module.exports = userOnUpdate;
//# sourceMappingURL=onDispatchRiderAssign.f.js.map