import { Component, OnInit } from '@angular/core';
import {GlobalvarsService} from '../services/globalvars.service';
import {ApiService} from '../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-browser',
  templateUrl: './item-browser.component.html',
  styleUrls: ['./item-browser.component.css']
})
export class ItemBrowserComponent implements OnInit {
  itemdisplay = {};

  constructor(private global: GlobalvarsService, private api: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.global.globalvars.current_component = "items";
    this.fetchAllAgreements();
  }

  fetchAllAgreements = function () {
    let request_payload = {status: 'CREATED'};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENTS").then(response => {this.itemdisplay = response;})
  };

  agreementClick = function (agreement_id) {
    this.router.navigate(['item', agreement_id]);
  }
}
