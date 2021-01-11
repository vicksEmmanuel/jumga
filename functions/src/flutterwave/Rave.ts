import forge from 'node-forge';
import md5 from 'md5';
import axios from 'axios';
import * as _ from 'lodash';


const { raveEndpoint, currency, storePrice} = require("../helpers/config");

export interface Customers {
  email:string,
  name: string,
  phonenumber? : string
}

export interface PaymentCustomization {
  title:string,
  description: string
  logo: string
}

class Rave {
  public_key: string;
  secret_key: string;
  /**
   * Rave object constructor
   * @param {*} public_key This is a string that can be found in merchant rave dashboard
   * @param {*} secret_key This is a string that can be found in merchant rave dashboard
   */
  constructor(public_key: string, secret_key: string) {
    this.public_key = public_key;
    this.secret_key = secret_key;
  }

  encryptCardDetails(cardDetails) {
    const card_details = JSON.stringify(cardDetails);
    const cipher = forge.cipher.createCipher(
      "3DES-ECB",
      forge.util.createBuffer(this.getKey())
    );
    cipher.start({ iv: "" });
    cipher.update(forge.util.createBuffer(card_details, "utf-8"));
    cipher.finish();
    const encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
  }

  getKey() {
    const sec_key = this.secret_key;
    const keymd5 = md5(sec_key);
    const keymd5last12 = keymd5.substr(-12);

    const seckeyadjusted = sec_key.replace("FLWSECK-", "");
    const seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12);

    return seckeyadjustedfirst12 + keymd5last12;
  }

  async getTotalCostOfCart (newCurrency, currencyPricePerDollar, valuePrice) {
    try {
      if (newCurrency === currency) {
        return {
          cost: valuePrice,
          currency: newCurrency
        }
      }

      return {
        cost: currencyPricePerDollar * Number(valuePrice),
        currency: newCurrency
      }
    } catch(e) {
      console.log("Error in Rave class == ", e);
      throw new Error(`Exchange rate error ${e?.message}`);
    }
  }

  async getPriceAndCurrency(newCurrency, currencyPricePerDollar){
    try {
      if (newCurrency === currency) {
        return {
          cost: storePrice,
          currency: newCurrency
        }
      }
      // const newExchange = await axios.get(`https://free.currconv.com/api/v7/convert?q=${currency}_${newCurrency}&compact=ultra&apiKey=${currencyExchangeApiKey}`, {
      //   headers: {
      //     'Content-Type': 'application/json; charset=utf-8',
      //     'Access-Control-Allow-Origin': '*',
      //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      //   }
      // });
      // console.log(newExchange.data);
      // if(_.isEmpty(newExchange.data)) throw new Error('Something went wrong with currency exchange');
      // const x = Object.keys(newExchange.data).map(i => {
      //     return newExchange.data[i];
      // });  
      return {
          cost: currencyPricePerDollar * storePrice,
          currency: newCurrency
      };
    } catch(err) {
      console.log(err);
      throw new Error("Exchange rate error");
    }
  }

  initiatePayment(paymentDetails: {
    tx_ref: string,
    amount: number,
    currency: string,
    integrity_hash: string,
    payment_options: string,
    customer: Customers,
    customization: PaymentCustomization,
    payment_plan ? : string
  }) {

    const paymentOptions = {
      headers: {
        'Authorization': `Bearer ${this.secret_key}`
      },
    }

    return new Promise((resolve, reject) => {
      console.log("payment_options == ", paymentOptions);
      axios.post(raveEndpoint, paymentDetails, paymentOptions)
        .then(result => {
          resolve({
            status: result.status,
            data: result.data
          });
        })
        .catch(err => {
          reject(err);
        })
    });
  }
}

module.exports = Rave;
