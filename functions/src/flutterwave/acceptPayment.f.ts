import * as functions from 'firebase-functions';
import * as _ from 'lodash';


const acceptPayment = functions.https.onRequest(async (req: functions.Request, res: functions.Response <any>) => {

  const body = req?.body;
  
  console.log("Flutterwave added some params", req.params);
  console.log("Flutterwave added some headers", req.headers);
  console.log("Flutterwave came here", body);

  res.send(200);
});

module.exports = acceptPayment;