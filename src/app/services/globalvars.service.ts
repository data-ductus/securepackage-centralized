import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

/* GlobalvarsService: stores global variables in a JSON object */
@Injectable()

export class GlobalvarsService {

  //Global variable object
  globalvars = {
    account_logged_in: null,
    account_full_name: null,
    account_street_address: null,
    account_city: null,
    account_postal_code: null,
    current_component: "",
    clerk_logged_in: null
  };

  constructor(private router: Router) { }

  changeMenu = function(new_menu) {
    this.globalvars.current_component = new_menu;
  };

  setUserVariables = function(account_id, account_full_name, account_street_address, account_city, account_postal_code) {
    this.globalvars.account_logged_in = account_id;
    this.globalvars.account_full_name = account_full_name;
    this.globalvars.account_street_address = account_street_address;
    this.globalvars.account_city = account_city;
    this.globalvars.account_postal_code = account_postal_code;
  };

  checkUserAuthentication = function() {
    if (this.globalvars.account_logged_in == null) {
      this.router.navigate(['']);
    }
  }
}
