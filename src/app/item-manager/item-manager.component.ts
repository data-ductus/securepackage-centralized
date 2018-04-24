import {Component, OnInit} from '@angular/core';
import {GlobalvarsService} from '../services/globalvars.service';
import {ApiService} from '../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GenerationService} from '../services/generation.service';

/* ItemManagerComponent: handles item management by the user, as well as proposals */
@Component({selector: 'app-item-manager', templateUrl: './item-manager.component.html'})

export class ItemManagerComponent implements OnInit {

  //Information display arrays
  item_display;
  proposal_display;
  purchase_display;
  history_display;

  //Current menu
  manager_type;

  //Terms of a given item
  item_terms;

  //Default state
  proposal_state_chosen = "PROPOSED";

  //Helper button for deletion modal
  item_to_delete;

  constructor(private global: GlobalvarsService, private api: ApiService, private route: ActivatedRoute, private router: Router, private generator: GenerationService) { }

  ngOnInit() {
    this.global.changeMenu("itemmanager");
    this.global.globalvars.clerk_logged_in = null;
    this.route.params.subscribe(params => {this.manager_type = params['action'];});
    this.fetchUserItems();
    this.fetchUserPurchases();
    this.fetchUserProposals();
    this.fetchUserHistory();
  }


  //Fetches user's items
  fetchUserItems = function() {
    let request_payload = {user_search: this.global.globalvars.account_logged_in};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENTS").then(response => {this.item_display = response})
  };

  //Fetches user's proposals
  fetchUserProposals = function() {
    let request_payload = {user_search: this.global.globalvars.account_logged_in};
    this.api.serverRequest(request_payload, "FETCH_USER_PROPOSALS").then(response => {this.proposal_display = response})
  };

  //Fetches user's purchases
  fetchUserPurchases = function() {
    let request_payload = {buyer_search: this.global.globalvars.account_logged_in};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENTS").then(response => {this.purchase_display = response})
  };

  fetchUserHistory = function() {
    let request_payload = {account_id: this.global.globalvars.account_logged_in};
    this.api.serverRequest(request_payload, "FETCH_ACCOUNT_HISTORY").then(response => {this.history_display = response})
  };

  //Fetches terms of a given item/agreement
  fetchItemTerms = function(item_id) {
    this.proposal_state_chosen = "PROPOSED";
    let request_payload = {id: item_id};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENT_TERMS").then(response => this.item_terms = response);
  };

  //Removes a proposal
  removeProposal = function(terms_id) {
    let request_payload = {terms: terms_id};
    this.api.serverRequest(request_payload, "REMOVE_PROPOSAL").then(response => this.fetchUserProposals());
  };

  //Rejects a proposal
  rejectProposal = function(terms_id) {
    let request_payload = {terms: terms_id};
    this.api.serverRequest(request_payload, "REJECT_PROPOSAL").then(response => {
      this.fetchUserItems();
      this.router.navigate(['itemmanager', 'adverts'])
    });
  };

  //Accepts a proposal
  acceptProposal = function (terms_id, agreement_id, buyer_id) {
    let request_payload = {terms: terms_id, agreement: agreement_id, time: this.generator.generateCurrentTime(), buyer: buyer_id};
    this.api.serverRequest(request_payload, "ACCEPT_PROPOSAL").then(response => this.fetchUserItems());
  };

  //Removes/inactivates an item/agreement
  removeItem = function () {
    let request_payload = {agreement: this.item_to_delete};
    this.api.serverRequest(request_payload, "REMOVE_ITEM").then(response => this.fetchUserItems());
  };

  //Navigates to AgreementComponent for detailed viewing of an accepted agreement
  moveToAgreement = function (agreement_id) {
    this.router.navigate(['agreement', agreement_id]);
  };

  exploreAddress = function(address) {
    this.router.navigate(['explorer', address]);
  };
}
