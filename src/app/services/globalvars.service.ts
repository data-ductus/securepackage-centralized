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

  /**
   * Changes current menu variable.
   *
   * @param new_menu New menu.
   */
  changeMenu = function(new_menu) {
    this.globalvars.current_component = new_menu;
  };

  /**
   * Sets user details and information.
   *
   * @param account_id Account identifier.
   * @param account_full_name Full name of the user.
   * @param account_street_address Street address of the user.
   * @param account_city City of the user.
   * @param account_postal_code Postal code of user's city.
   */
  setUserVariables = function(account_id, account_full_name, account_street_address, account_city, account_postal_code) {
    this.globalvars.account_logged_in = account_id;
    this.globalvars.account_full_name = account_full_name;
    this.globalvars.account_street_address = account_street_address;
    this.globalvars.account_city = account_city;
    this.globalvars.account_postal_code = account_postal_code;
  };

  /**
   * Check if user is allowed to view the component. If not, redirects to LoginComponent.
   */
  checkUserAuthentication = function() {
    if (this.globalvars.account_logged_in == null) {
      this.router.navigate(['']);
    }
  }
}
