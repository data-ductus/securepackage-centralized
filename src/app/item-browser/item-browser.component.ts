import {Component, OnInit} from '@angular/core';
import {GlobalvarsService} from '../services/globalvars.service';
import {ApiService} from '../services/api.service';
import {Router, ActivatedRoute} from '@angular/router';

/* ItemBrowserComponent: handles item (advert) browsing */
@Component({selector: 'app-item-browser', templateUrl: './item-browser.component.html'})

export class ItemBrowserComponent implements OnInit {
  item_display;

  constructor(private global: GlobalvarsService, private api: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.global.changeMenu("items");
    this.global.globalvars.clerk_logged_in = null;
    this.fetchAllAgreements();
    this.api.serverRequest({agreement_id: "dec1cb540229da9827e0560b7d3d886b01e2824c"}, "FETCH_LOGISTICS_INFO")
  }

  //Fetches all items, that are up for sale
  fetchAllAgreements = function () {
    let request_payload = {status: 'CREATED'};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENTS").then(response => {this.item_display = response})
  };

  //Navigates to ItemComponent to view the clicked item in detail
  agreementClick = function (agreement_id) {
    this.router.navigate(['item', agreement_id]);
  };
}
