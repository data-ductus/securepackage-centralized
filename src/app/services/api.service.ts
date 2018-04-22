import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenerationService} from './generation.service';

/* ApiService: handles communication with the backend */
@Injectable()

export class ApiService {

  //Target backend address
  server_target = 'http://localhost/securepackage_api/api_main.php';

  constructor(private http: HttpClient, private generator: GenerationService) { }

  //Performs a login request
  serverLoginRequest = function(account_data) {

    //Append login action to request payload
    account_data.action = "LOGIN";
    let promise = new Promise((resolve) => {
      this.http.post(this.server_target, account_data).subscribe(data => {
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

  //Performs a server call, able to send and retrieve JSON arrays
  serverRequest = function (payload, action) {

    //Append action and timestamp to request payload
    payload.action = action;
    payload.event_timestamp = this.generator.generateCurrentTime();

    //Perform HTTP call to the API
    let promise = new Promise((resolve) => {
      this.http.post(this.server_target, payload).subscribe(data => {
        console.log(data);
        resolve(data);})
    });
    return promise;
  }
}
