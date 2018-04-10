import { Component, OnInit } from '@angular/core';
import { GlobalvarsService } from '../services/globalvars.service';
import { ApiService } from '../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GenerationService} from '../services/generation.service';

@Component({
  selector: 'app-item-manager',
  templateUrl: './item-manager.component.html',
  styleUrls: ['./item-manager.component.css']
})
export class ItemManagerComponent implements OnInit {

  itemdisplay = {};
  proposaldisplay = {};
  purchasedisplay = {};

  manager_type;

  item_terms;

  proposal_state_chosen = "PROPOSED";

  constructor(private global: GlobalvarsService, private api: ApiService, private route: ActivatedRoute, private router: Router, private generator: GenerationService) { }

  ngOnInit() {
    this.global.globalvars.current_component = "itemmanager";
    this.route.params.subscribe(params => {this.manager_type = params['action'];});
    this.fetchUserItems();
    this.fetchUserPurchases();
    this.fetchUserProposals();
  }

  fetchUserItems = function() {
    let request_payload = {user_search: this.global.globalvars.account_logged_in};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENTS").then(response => {this.itemdisplay = response;})
  };

  fetchUserProposals = function() {
    let request_payload = {user_search: this.global.globalvars.account_logged_in};
    this.api.serverRequest(request_payload, "FETCH_USER_PROPOSALS").then(response => {this.proposaldisplay = response;})
  };

  fetchUserPurchases = function() {
    let request_payload = {buyer_search: this.global.globalvars.account_logged_in};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENTS").then(response => {this.purchasedisplay = response;})
  };

  fetchItemTerms = function(item_id) {
    this.proposal_state_chosen = "PROPOSED";
    let request_payload = {id: item_id};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENT_TERMS").then(response => this.item_terms = response);
  };

  removeProposal = function(terms_id) {
    let request_payload = {terms: terms_id};
    this.api.serverRequest(request_payload, "REMOVE_PROPOSAL").then(response => console.log(response));
  };

  rejectProposal = function(terms_id) {
    let request_payload = {terms: terms_id};
    this.api.serverRequest(request_payload, "REJECT_PROPOSAL").then(response => console.log(response));
  };

  acceptProposal = function (terms_id, agreement_id, buyer_id) {
    let request_payload = {
      terms: terms_id,
      agreement: agreement_id,
      time: this.generator.generateCurrentTime(),
      buyer: buyer_id};
    this.api.serverRequest(request_payload, "ACCEPT_PROPOSAL").then(response => console.log(response));
  };

  removeItem = function (agreement_id) {
    let request_payload = {agreement: agreement_id};
    this.api.serverRequest(request_payload, "REMOVE_ITEM").then(response => console.log(response));
  };

  moveToAgreement = function (agreement_id) {
    this.router.navigate(['agreement', agreement_id]);
  }
}
