"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const { DATABASE } = require("../helpers/constants");
const db = firebase_admin_1.firestore();
const getYearTemplate = () => {
    const years = {};
    [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].forEach(id => {
        years[`${id}`] = { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sept: 0, oct: 0, nov: 0, dec: 0 };
    });
    return years;
};
const retrieveAllDocumentsInCollction = (collectionName) => {
    return new Promise(async (resolve, reject) => {
        const doc = db.collection(collectionName);
        const docData = await doc.get();
        resolve(docData.empty ? [] : docData);
    });
};
const determineWhatMonth = (dateJoined, yearToAdd, userJoiningHolder) => {
    switch (dateJoined) {
        case 1:
            userJoiningHolder[yearToAdd].jan += 1;
            break;
        case 2:
            userJoiningHolder[yearToAdd].feb += 1;
            break;
        case 3:
            userJoiningHolder[yearToAdd].mar += 1;
            break;
        case 4:
            userJoiningHolder[yearToAdd].apr += 1;
            break;
        case 5:
            userJoiningHolder[yearToAdd].may += 1;
            break;
        case 6:
            userJoiningHolder[yearToAdd].jun += 1;
            break;
        case 7:
            userJoiningHolder[yearToAdd].jul += 1;
            break;
        case 8:
            userJoiningHolder[yearToAdd].aug += 1;
            break;
        case 9:
            userJoiningHolder[yearToAdd].sept += 1;
            break;
        case 10:
            userJoiningHolder[yearToAdd].oct += 1;
            break;
        case 11:
            userJoiningHolder[yearToAdd].nov += 1;
            break;
        case 12:
            userJoiningHolder[yearToAdd].dec += 1;
            break;
        default:
            break;
    }
};
const determineWhatRevenueMonth = (dateJoined, yearToAdd, userJoiningHolder, amount) => {
    switch (dateJoined) {
        case 1:
            userJoiningHolder[yearToAdd].jan += amount;
            break;
        case 2:
            userJoiningHolder[yearToAdd].feb += amount;
            break;
        case 3:
            userJoiningHolder[yearToAdd].mar += amount;
            break;
        case 4:
            userJoiningHolder[yearToAdd].apr += amount;
            break;
        case 5:
            userJoiningHolder[yearToAdd].may += amount;
            break;
        case 6:
            userJoiningHolder[yearToAdd].jun += amount;
            break;
        case 7:
            userJoiningHolder[yearToAdd].jul += amount;
            break;
        case 8:
            userJoiningHolder[yearToAdd].aug += amount;
            break;
        case 9:
            userJoiningHolder[yearToAdd].sept += amount;
            break;
        case 10:
            userJoiningHolder[yearToAdd].oct += amount;
            break;
        case 11:
            userJoiningHolder[yearToAdd].nov += amount;
            break;
        case 12:
            userJoiningHolder[yearToAdd].dec += amount;
            break;
        default:
            break;
    }
};
const getOrderStat = async () => {
    const orderSnapshot = await retrieveAllDocumentsInCollction(DATABASE.ORDER);
    const ordersPerMonth = getYearTemplate();
    orderSnapshot.forEach(doc => {
        const orderDate = new Date(doc.data().orderDate.toDate());
        const getYear = `${orderDate.getFullYear()}`;
        determineWhatMonth(orderDate.getMonth() + 1, getYear, ordersPerMonth);
    });
    return {
        numberOfOrders: orderSnapshot.size ? orderSnapshot.size : 0,
        numOfOrdersPerMonth: ordersPerMonth
    };
};
const getRevenueStat = async () => {
    const revenueSnapshot = await retrieveAllDocumentsInCollction(DATABASE.JUMGA);
    const revenuePerMonth = getYearTemplate();
    const deliveryRevenuePerMonth = getYearTemplate();
    revenueSnapshot.forEach(doc => {
        var _a, _b;
        const createdDate = new Date(doc.data().createdDate.toDate());
        const getYear = `${createdDate.getFullYear()}`;
        determineWhatRevenueMonth(createdDate.getMonth() + 1, getYear, revenuePerMonth, Number((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.commissionFromSales));
        determineWhatRevenueMonth(createdDate.getMonth() + 1, getYear, deliveryRevenuePerMonth, Number((_b = doc.data()) === null || _b === void 0 ? void 0 : _b.commissionFromDelivery));
    });
    return {
        revenuePerMonth,
        deliveryRevenuePerMonth
    };
};
const getStat = async () => {
    const pendingRevenueSnapshot = await retrieveAllDocumentsInCollction(DATABASE.ORDER);
    const totalRevenueSnapshot = await retrieveAllDocumentsInCollction(DATABASE.JUMGA);
    const productsSnapshot = await retrieveAllDocumentsInCollction(DATABASE.PRODUCT);
    let pendingRevenue = 0;
    let pendingDeliveryRevenue = 0;
    let totalRevenue = 0;
    let deliveryWalletBalance = 0;
    let totalProductNumber = 0;
    pendingRevenueSnapshot.forEach(doc => {
        var _a, _b, _c;
        if (!((_a = doc.data()) === null || _a === void 0 ? void 0 : _a.isDelivered)) {
            pendingRevenue += (_b = doc.data()) === null || _b === void 0 ? void 0 : _b.totalCostOfCommissionOnSales;
            pendingDeliveryRevenue += (_c = doc.data()) === null || _c === void 0 ? void 0 : _c.totalcostOfCommissionOnDelivery;
        }
    });
    totalRevenueSnapshot.forEach(doc => {
        var _a, _b;
        totalRevenue += (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.commissionFromSales;
        deliveryWalletBalance += (_b = doc.data()) === null || _b === void 0 ? void 0 : _b.commissionFromDelivery;
    });
    totalProductNumber = productsSnapshot.size;
    return {
        pendingRevenue,
        totalRevenue,
        totalProductNumber,
        pendingDeliveryRevenue,
        deliveryWalletBalance
    };
};
const getUserStat = async () => {
    const userSnapshot = await retrieveAllDocumentsInCollction(DATABASE.USER);
    const usersPerMonth = getYearTemplate();
    userSnapshot.forEach(doc => {
        const userDate = new Date(doc.data().createdAt.toDate());
        const getYear = `${userDate.getFullYear()}`;
        determineWhatMonth(userDate.getMonth() + 1, getYear, usersPerMonth);
    });
    return {
        numberOfUsers: userSnapshot.size ? userSnapshot.size : 0,
        numOfUsersPerMonth: usersPerMonth
    };
};
const getAdminStatistics = async () => {
    const { numberOfOrders, numOfOrdersPerMonth } = await getOrderStat();
    const { revenuePerMonth, deliveryRevenuePerMonth } = await getRevenueStat();
    const { pendingRevenue, totalRevenue, totalProductNumber, pendingDeliveryRevenue, deliveryWalletBalance } = await getStat();
    const { numberOfUsers, numOfUsersPerMonth } = await getUserStat();
    return {
        numberOfOrders,
        numOfOrdersPerMonth,
        revenuePerMonth,
        usersPerMonth: numOfUsersPerMonth,
        numberOfUsers,
        numOfProducts: totalProductNumber,
        walletBalance: totalRevenue,
        pendingBalance: pendingRevenue,
        pendingDeliveryRevenue,
        deliveryWalletBalance,
        deliveryRevenuePerMonth
    };
};
module.exports = functions.https.onCall(async (data, context) => {
    const statistics = await getAdminStatistics();
    return {
        statistics
    };
});
//# sourceMappingURL=getStatistics.f.js.map