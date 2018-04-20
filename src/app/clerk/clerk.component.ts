import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalvarsService} from '../services/globalvars.service';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-clerk',
  templateUrl: './clerk.component.html',
  styleUrls: ['./clerk.component.css']
})
export class ClerkComponent implements OnInit {

  address;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private global: GlobalvarsService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.address = params['id'];
      }
    });
  }
}
