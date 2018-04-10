import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalvarsService} from './globalvars.service';

@Injectable()
export class ApiService {

  servertarget = 'http://localhost/securepackage_api/api_main.php';

  constructor(private http: HttpClient, private  global: GlobalvarsService) { }

  serverLoginRequest = function(account_data) {
    account_data.action = "LOGIN";
    let promise = new Promise((resolve) => {
      this.http.post(this.servertarget, account_data).subscribe(data => {
        console.log(data);
        if(data['status'] == "LOGIN_SUCCESS") {
          resolve(data);
        }
        else {
          resolve(null);
        }
      })
    });
    return promise;
  };

  serverRequest = function (payload, action) {
    payload.action = action;
    let promise = new Promise((resolve) => {
      this.http.post(this.servertarget, payload).subscribe(data => {
        console.log(data);
        resolve(data);})
    });
    return promise;
  }
}
