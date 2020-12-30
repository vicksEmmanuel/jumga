"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// import * as moment from 'moment';
const { documents } = require('../helpers/config');
const userOnUpdate = functions.firestore.document(`${documents.USER}/{userId}`).onWrite(async (change, context) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const isOnCreate = !((_a = change === null || change === void 0 ? void 0 : change.before) === null || _a === void 0 ? void 0 : _a.exists) && ((_b = change === null || change === void 0 ? void 0 : change.after) === null || _b === void 0 ? void 0 : _b.exists);
    const isOnUpdate = ((_c = change === null || change === void 0 ? void 0 : change.before) === null || _c === void 0 ? void 0 : _c.exists) && ((_d = change === null || change === void 0 ? void 0 : change.after) === null || _d === void 0 ? void 0 : _d.exists);
    console.log("isOnCreate == ", isOnCreate);
    console.log("isOnUpdate == ", isOnUpdate);
    const oldData = (_e = change === null || change === void 0 ? void 0 : change.before) === null || _e === void 0 ? void 0 : _e.data();
    const newData = (_f = change === null || change === void 0 ? void 0 : change.after) === null || _f === void 0 ? void 0 : _f.data();
    // console.log("oldData == ", oldData)
    // console.log("newData == ", newData)
    const oldUpdatedAt = oldData === null || oldData === void 0 ? void 0 : oldData.updated_at;
    const { updated_at: newUpdatedAt } = newData;
    try {
        const db = admin === null || admin === void 0 ? void 0 : admin.firestore();
        const userId = (_g = context === null || context === void 0 ? void 0 : context.params) === null || _g === void 0 ? void 0 : _g.userId;
        const docPath = `${documents.USER}/${userId}`;
        const canUpdate = ((newUpdatedAt === null || newUpdatedAt === void 0 ? void 0 : newUpdatedAt._seconds) !== (oldUpdatedAt === null || oldUpdatedAt === void 0 ? void 0 : oldUpdatedAt._seconds)) ? false : true;
        console.log("canUpdate == ", canUpdate);
        if (isOnCreate) {
            await db.doc(docPath).update({ updated_at: new Date() });
        }
        else if (isOnUpdate && canUpdate) {
            await db.doc(docPath).update({ updated_at: new Date() });
        }
    }
    catch (error) {
        console.log("error from updating user update_at entry == ", error);
    }
    return true;
});
module.exports = userOnUpdate;
//# sourceMappingURL=onUpdate.f.js.map