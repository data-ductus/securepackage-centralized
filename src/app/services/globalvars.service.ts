import { Injectable } from '@angular/core';

@Injectable()
export class GlobalvarsService {

  globalvars = {
    account_logged_in: null,
    account_full_name: null,
    account_street_address: null,
    account_city: null,
    account_postal_code: null,
    current_component: ""
  };

  constructor() { }

}
