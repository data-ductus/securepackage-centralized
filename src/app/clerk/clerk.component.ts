import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalvarsService} from '../services/globalvars.service';
import {ApiService} from '../services/api.service';

@Component({selector: 'app-clerk', templateUrl: './clerk.component.html'})

export class ClerkComponent implements OnInit {

  address;

  clerk_id = "admin";
  clerk_password = "admin";
  clerk_authorized = false;

  clerk_agreements;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private global: GlobalvarsService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.address = params['id'];
      }
    });
  }

  clerkLogin = function() {
    let request_payload = {address: this.clerk_id, password: this.clerk_password};
    this.api.serverRequest(request_payload, "CLERK_LOGIN").then(userdata => {
      if (userdata != null) {
        this.clerk_authorized = true;
        this.api.serverRequest({}, "FETCH_CLERK_AGREEMENTS").then(data => this.clerk_agreements = data);
      }
    });
  }
}
