import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit {

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

  address;

  recent_events = {};
  recent_agreements = {};

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.address = params['id'];
      }
      else {
        this.api.serverRequest({}, "FETCH_RECENT_EVENTS").then(data => this.recent_events = data);
        this.api.serverRequest({}, "FETCH_RECENT_AGREEMENTS").then(data => this.recent_agreements = data);
      }
    });
  }

  explore_address = function (address) {
    this.router.navigate(['explorer', address]);
  }
}
