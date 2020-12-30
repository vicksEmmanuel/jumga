import * as functions from 'firebase-functions';
import * as _ from 'lodash';

const handleRedirect = functions.https.onRequest(async (req, res) => {
  
  console.log("Entering handleRedirect with req.query object == ", req.query);

  const response = req.query.response;

  console.log("response in handleRedirect before parsed ", response);

  const parsedResponse = JSON.parse(response);

  console.log("final Response in handleRedirect call == ", parsedResponse);

  if (parsedResponse.status && parsedResponse.status == "failed") {
    res.status(502).send(new Error(`${parsedResponse.status}: ${parsedResponse.vbvrespmessage}`));
  }
  else {

    const embedToken = parsedResponse.chargeToken.embed_token;

    res.status(201).send({
      success: true,
      message: parsedResponse.status,
      token: embedToken
    });

  }

  res.status(201).send({
    success: true,
    message: parsedResponse.status,
    token: parsedResponse.chargeToken.embed_token
  });

});

module.exports = handleRedirect;
