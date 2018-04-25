import {Injectable} from '@angular/core';

/* GenerationService: contains helper function for time, hash, ID and byte array generation */
@Injectable()
export class GenerationService {

  constructor() { }

  /**
   * Generates a 160-bit identification number.
   *
   * @returns {string} 160-bit identifier.
   */
  generate160bitId = function() {
    let id = "";
    let possible = "0123456789abcdef";

    for (let i = 0; i < 40; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
  };

  /**
   * Generates current time in MySQL format.
   *
   * @returns {string} Current time in MySQL format.
   */
  generateCurrentTime = function() {
    //Fetch current time
    let now     = new Date();
    let year    = now.getFullYear().toString();
    let month   = (now.getMonth()+1).toString();
    let day     = now.getDate().toString();
    let hour    = now.getHours().toString();
    let minute  = now.getMinutes().toString();
    let second  = now.getSeconds().toString();

    //Format parameters in case of the containing only one character
    if(month.toString().length == 1) {
      month = '0' + month;
    }
    if(day.toString().length == 1) {
      day = '0' + day;
    }
    if(hour.toString().length == 1) {
      hour = '0' + hour;
    }
    if(minute.toString().length == 1) {
      minute = '0' + minute;
    }
    if(second.toString().length == 1) {
      second = '0' + second;
    }

    //Return in MySQL format
    return "'" + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + "'";
  };

  /**
   * Converts byte array to hexadecimal string.
   *
   * @param byteArray Byte array to parse
   * @returns {string} Hex string.
   */
  byteArrayToHexString = function(byteArray) {
    let s = '';
    byteArray.forEach(function(byte) {
      s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    });
    return s;
  };

  /**
   * Converts hexadecimal string to byte array
   *
   * @param str Hex string to parse.
   * @returns {Uint8Array} Byte array.
   */
  stringToByteArray = function(str) {
    let arraybuf = new ArrayBuffer(str.length*2);
    let bufView = new Uint8Array(arraybuf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
  };

  /**
   * Gets 160-bit address from 256-bit long public key.
   *
   * @param string Public key.
   * @returns {string} 160-bit address.
   */
  getAddress = function (string){
    let address = '';
    for (let i = 0; i < string.length; i++) {
      if (i >= 24) {
        address += string[i];
      }
    }
    return address;
  }
}
