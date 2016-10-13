import md5 from 'md5';
import Crc from './crc';

import queryString from 'query-string';

export default class Tpay {

  constructor(options, client, crc) {
    this.client = client;
    this.merchantId = options.merchantId;
    this.merchantCode = options.merchantCode;
    this.description = options.description;
    this.price = options.price.toFixed(2);

    if (!this.price || this.price <= 0) {
      throw new Error();
    }

    this.crc = crc;
    if (this.crc === undefined) {
      this.crc = Crc.generate(6);
    }
  }

  generateQueryString(returnUrl, returnUrlIfError) {

    let tpayArray = {
      'id': this.merchantId,
      'kwota': this.price,
      'opis': this.description,
      'crc': this.crc,
      'nazwisko': this.client.name,
      'email': this.client.email,
      'pow_url': returnUrl,
      'pow_url_blad': returnUrlIfError,
      'md5sum': md5(this.merchantId.toString() + this.price + this.crc + this.merchantCode)
    };

    return 'https://secure.transferuj.pl/?' + queryString.stringify(tpayArray);
  }

}

