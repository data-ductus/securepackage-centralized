import {Component, OnInit} from '@angular/core';
import {GlobalvarsService} from './services/globalvars.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from './services/api.service';

/* AppComponent: handles navbar functionality and routing between components */
@Component({selector: 'app-root', templateUrl: './app.component.html'})
export class AppComponent implements OnInit {

  constructor (private global: GlobalvarsService, private route: ActivatedRoute, private router: Router, private api: ApiService) {}

  ngOnInit () {
  }

  /**
   * Logs out a user.
   */
  logout = function() {
    this.global.globalvars.account_logged_in = null;
    this.global.globalvars.account_full_name = null;
    this.global.globalvars.account_city = null;
    this.global.globalvars.account_postal_code = null;
    this.global.globalvars.account_street_address = null;
    this.router.navigate(['']);
  };

  /**
   * Log out function for clerks
   */
  logoutClerk = function() {
    this.global.globalvars.clerk_logged_in = null;
    this.router.navigate(['clerk']);
  };

  /**
   * Redirects to ItemManagerComponent
   * @param arg Menu type within ItemManagerComponent
   */
  itemmanager = function(arg) {
    if (this.global.globalvars.account_logged_in != null) {
      this.router.navigate(['itemmanager', arg]);
    }
  };

  /**
   * Redirects to NewItemComponent
   */
  newitem = function() {
    if (this.global.globalvars.account_logged_in != null) {
      this.router.navigate(['newitem']);
    }
  };

  /**
   * Redirects to ClerkComponent.
   */
  clerk = function() {
    this.logout();
    this.router.navigate(['clerk']);
  };

  /**
   * Updates user information.
   */
  updateUserInfo = function() {
    let request_payload = {
      account_id: this.global.globalvars.account_logged_in,
      street_address: this.global.globalvars.account_street_address,
      city: this.global.globalvars.account_city,
      postcode: this.global.globalvars.account_postal_code
    };
    this.api.serverRequest(request_payload, "UPDATE_USER_INFO").then(data => console.log(data));
  };


}
