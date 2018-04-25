import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../services/api.service';
import {GenerationService} from '../services/generation.service';
import {GlobalvarsService} from '../services/globalvars.service';

/* ItemComponent: handles item display and proposal creation */
@Component({selector: 'app-item', templateUrl: './item.component.html'})

export class ItemComponent implements OnInit {
  agreement_id;

  //Item parameters
  item_agreement_params;
  item_terms;
  item_item_params;
  item_images;
  item_default_terms;

  //Proposed terms parameters
  terms_identification;

  terms_accelerometer = false;
  terms_humidity = false;
  terms_temperature = false;
  terms_pressure = false;
  terms_gps = false;

  terms_item_price = 0;
  terms_item_postage = 0;

  sensor_pressure_low = null; sensor_pressure_high = null;
  sensor_humidity_low = null; sensor_humidity_high = null;
  sensor_temperature_low = null; sensor_temperature_high = null;
  sensor_accelerometer = null;

  //Default status of proposal display
  proposal_state_chosen = "PROPOSED";

  constructor(private route: ActivatedRoute, private api: ApiService, private generator: GenerationService, private global: GlobalvarsService, private router: Router) { }

  ngOnInit() {
    this.global.changeMenu("items");
    this.global.globalvars.clerk_logged_in = null;
    this.route.params.subscribe(params => {
      this.agreement_id = params['id'];
      this.fetchAgreementDetails();
    });
  }

  /**
   * Fetches agreement details and sets according variables.
   */
  fetchAgreementDetails = function () {
    let request_payload = {id: this.agreement_id};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENT_INFO").then(response => this.item_agreement_params = response);
    this.api.serverRequest(request_payload, "FETCH_AGREEMENT_ITEM").then(response => this.item_item_params = response);
    this.api.serverRequest(request_payload, "FETCH_AGREEMENT_IMAGES").then(response => this.item_images = response);
    this.api.serverRequest(request_payload, "FETCH_AGREEMENT_TERMS").then(response => this.item_terms = response);
    this.api.serverRequest(request_payload, "FETCH_CURRENT_AGREEMENT_TERMS").then(response => this.assignDefaultTerms(response));
  };

  /**
   * Assignes default terms that can be changed by the potential buyer.
   *
   * @param terms Default terms.
   */
  assignDefaultTerms = function(terms) {
    //Set general information
    this.terms_identification = this.generator.generate160bitId();
    this.item_default_terms = terms;
    this.terms_item_price = terms.price;
    this.terms_item_postage = terms.postage_time;

    //Set default sensor configuration
    if (terms.accelerometer !== null) {
      this.terms_accelerometer = true;
      this.sensor_accelerometer = terms.accelerometer;
    }
    if (terms.pressure_low !== null) {
      this.terms_pressure = true;
      this.sensor_pressure_low = terms.pressure_low;
      this.sensor_pressure_high = terms.pressure_high;
    }
    if (terms.humidity_low !== null) {
      this.terms_humidity = true;
      this.sensor_humidity_low = terms.humidity_low;
      this.sensor_humidity_high = terms.humidity_high;
    }
    if (terms.temperature_low !== null) {
      this.terms_temperature = true;
      this.sensor_temperature_low = terms.temperature_low;
      this.sensor_temperature_high = terms.temperature_high;
    }
    if (terms.gps == 1) {
      this.terms_gps = true;
    }
  };

  /**
   * Sends proposed terms to the API.
   */
  proposeTerms = function () {
    let request_payload = {
      terms_id: this.terms_identification,
      agreement_id: this.agreement_id,
      terms_price: this.terms_item_price,
      terms_shipmenttime: this.terms_item_postage,
      account: this.global.globalvars.account_logged_in,
      sensor_pressure_low: this.sensor_pressure_low,
      sensor_pressure_high: this.sensor_pressure_high,
      sensor_humidity_low: this.sensor_humidity_low,
      sensor_humidity_high: this.sensor_humidity_high,
      sensor_temperature_low: this.sensor_temperature_low,
      sensor_temperature_high: this.sensor_temperature_high,
      sensor_accelerometer: this.sensor_accelerometer,
      sensor_gps: this.terms_gps
    };
    this.api.serverRequest(request_payload, "PROPOSE_TERMS").then(data => this.fetchAgreementDetails());
  }
}
