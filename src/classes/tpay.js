import md5 from 'md5';
import Crc from './crc';

import queryString from 'query-string';

export default class Tpay {

  constructor(options, client, crc) {
    this.client = client;
    this.merchantId = options.merchantId;
    this.merchantCode = options.merchantCode;

    this.crc = crc;
    if (this.crc === undefined) {
      this.crc = Crc.generate(6);
    }
  }

  generateQueryString(amount, returnUrl, returnUrlIfError) {

    if (!amount || amount <= 0) {
      throw new Error();
    }

    let tpayArray = {
      'id': this.merchantId,
      'kwota': amount.toFixed(2),
      'opis': this.description,
      'crc': this.crc,
      'nazwisko': this.client.name,
      'email': this.client.email,
      'pow_url': returnUrl,
      'pow_url_blad': returnUrlIfError,
      'md5sum': md5(this.merchantId.toString() + amount.toFixed(2) + this.crc + this.merchantCode)
    };

    return 'https://secure.transferuj.pl/?' + queryString.stringify(tpayArray);
  }

}

