import {Injectable} from '@angular/core';

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
    current_component: ""
  };

  constructor() { }

  changeMenu = function(new_menu) {
    this.globalvars.current_component = new_menu;
  }
}
