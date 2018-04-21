import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import sha256, { Hash, HMAC } from "fast-sha256";
import {ApiService} from '../services/api.service';
import {GlobalvarsService} from '../services/globalvars.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  seedApi = 'http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=4&maxLength=6&limit=8' +
    '&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';

  generate_seed = '';
  generate_privateKey = '';
  generate_publicKey = '';
  generate_address = '';
  generate_password = '';
  generate_name = '';

  //login_address = 'f69953c171c4e1e765af94855a474eece47d57e5'; //For testing
  login_address = 'd2692e662e8f64664b8405ba182a0864dbf5d74e'; //For testing
  //login_address = '754f6cfb921efa9f78964a013f6879b7af771f2a'; //For testing
  //login_address = '0fe2e46e21c594cd6fe08e1a25039ebba48977ca'; // For testing
  //login_password = 'rlkjfnrlre5555'; //For testing
  login_password = 'dlkmcqp343444'; //For testing
  //login_password = 'af4857af4857'; //For testing
  //login_password = 'dlmewdwporew4'; // For testing

  constructor(private http: HttpClient, private api: ApiService, private route: ActivatedRoute, private router: Router, private global: GlobalvarsService) { }

  ngOnInit() {
    //this.login();  //For testing
    this.generateKeys();
    this.global.globalvars.current_component = "login";
    if (this.global.globalvars.account_logged_in != null) {
      this.router.navigate(['items']);
    }
  }

  generateKeys = function() {
    this.generate_seed = 'Generating...';
    this.http.get(this.seedApi).subscribe(data => {
      const seed_request = data;
      this.generate_seed = '';
      for (let i = 0; i < seed_request.length; i++) {
        this.generate_seed = this.generate_seed + seed_request[i]['word'].toString() + " ";
      }
      this.generate_seed = this.generate_seed.toLowerCase();
      let bytePrivateKey = sha256(stringToByteArray(this.generate_seed));
      let bytePublicKey = sha256(sha256(bytePrivateKey));
      this.generate_privateKey = byteArrayToHexString(bytePrivateKey);
      this.generate_publicKey = byteArrayToHexString(bytePublicKey);
      this.generate_address = getAddress(this.generate_publicKey);
    });
  };

  generateAccount = function() {
    if(validatePassword(this.generate_password)) {
      let request_payload = {
        address: this.generate_address,
        public_key: this.generate_publicKey,
        password: this.generate_password,
        name: this.generate_name
      };
      this.api.serverRequest(request_payload, "NEW_ACCOUNT").then(data=>{console.log(data)});
    }
  };

  login = function() {
    let accountdata = {
      address: this.login_address,
      password: this.login_password
    };
    this.api.serverLoginRequest(accountdata).then(userdata => {
      if (userdata != null) {
        this.global.globalvars.account_logged_in = userdata["address"];
        this.global.globalvars.account_full_name = userdata["name"];
        this.global.globalvars.account_street_address = userdata["street_address"];
        this.global.globalvars.account_postal_code = userdata["postcode"];
        this.global.globalvars.account_city = userdata["city"];
        this.router.navigate(['items']);
      } else if (userdata = null) {
        this.global.globalvars.account_logged_in = null;
      }
    });
  };
}

function byteArrayToHexString(byteArray) {
  let s = '';
  byteArray.forEach(function(byte) {
    s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
  });
  return s;
}

function stringToByteArray(str) {
  let arraybuf = new ArrayBuffer(str.length*2);
  let bufView = new Uint8Array(arraybuf);
  for (let i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

function hexToByteArray(string) {
  let bytes = new Uint8Array(Math.ceil(string.length / 2));
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(string.substr(i * 2, 2), 16);
  return bytes;
}

function getAddress(string) {
  let address = '';
  for (let i=0; i < string.length; i++) {
    if (i>=24) {
      address += string[i];
    }
  }
  return address;
}

function validatePassword(password) {
  let errors = [];
  if (password.length < 8) {
    errors.push("Your password must be at least 8 characters");
  }
  if (password.search(/[a-z]/i) < 0) {
    errors.push("Your password must contain at least one letter.");
  }
  if (password.search(/[0-9]/) < 0) {
    errors.push("Your password must contain at least one digit.");
  }
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return false;
  }
  return true;
}
