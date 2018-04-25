import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GenerationService} from '../services/generation.service';
import {ApiService} from '../services/api.service';
import {GlobalvarsService} from '../services/globalvars.service';
import {AmChartsService, AmChart} from '@amcharts/amcharts3-angular';

/* AgreementComponent: handles agreement information display in detail for the seller and the buyer */
@Component({selector: 'app-agreement', templateUrl: './agreement.component.html'})

export class AgreementComponent implements OnInit {
  agreement_id;

  current_location = {lat: null, lng: null};

  //Agreement parameters
  item_agreement_params;
  item_item_params;
  item_terms;
  logistics_params;
  agreement_events;
  clerk_decision;
  clerk_confirmed;

  //Charts
  private tempChart: AmChart;
  private pressChart: AmChart;
  private accChart: AmChart;
  private humidityChart: AmChart;

  time = [];
  tempData = [];
  accData = [];
  pressData = [];
  humidityData = [];

  time_step = 120;

  //Either return or delivery
  direction;

  //Sensor information
  sensor_selection = null;

  //Sensor inclusion
  accelerometer_sensor_id = null;
  pressure_sensor_id = null;
  temperature_sensor_id = null;
  humidity_sensor_id = null;
  gps_sensor_id = null;

  //Thresholds
  sensor_pressure_low = null; sensor_pressure_high = null;
  sensor_humidity_low = null; sensor_humidity_high = null;
  sensor_temperature_low = null; sensor_temperature_high = null;
  sensor_accelerometer = null;

  show_sensors = false;
  show_gps = false;
  show_events = false;


  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, private generator: GenerationService, private global: GlobalvarsService, private amCharts: AmChartsService) { }

  ngOnInit() {
    this.global.globalvars.clerk_logged_in = null;
    this.global.checkUserAuthentication();
    this.global.changeMenu("itemmanager");
    this.route.params.subscribe(params => {
      this.agreement_id = params['id'];
      this.initCharts();
      this.fetchAgreementDetails();
    });
  }

  /**
   * Initializes charts, sets data sources.
   */
  private initCharts = function() {
    this.tempChart = this.amCharts.makeChart( 'tempChartDiv', {
      'type': 'serial',
      'dataProvider': this.tempData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'temp',
        'type': 'column'
      } ]
    } );
    this.pressChart = this.amCharts.makeChart( 'pressChartDiv', {
      'type': 'serial',
      'dataProvider': this.pressData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'press',
        'type': 'column'
      } ]
    } );
    this.accChart = this.amCharts.makeChart( 'accChartDiv', {
      'type': 'serial',
      'dataProvider': this.accData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'acc',
        'type': 'column'
      } ]
    } );
    this.humidityChart = this.amCharts.makeChart( 'humidityChartDiv', {
      'type': 'serial',
      'dataProvider': this.humidityData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'humidity',
        'type': 'column'
      } ]
    } );
  };

  /**
   * Fetches agreement details and sets necessary variables.
   */
  fetchAgreementDetails = function () {
    let request_payload = {id: this.agreement_id, status: "ACCEPTED"};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENT_INFO").then(response => {
      this.item_agreement_params = response;

      //Determine the direction of package
      if (this.item_agreement_params.state == "TRANSIT" || this.item_agreement_params.state == "DELIVERED") {
        this.direction = "TRANSFER";
      }
      else if (this.item_agreement_params.state == "RETURN" || this.item_agreement_params.state == "RETURNED") {
        this.direction = "RETURN";
      }

      //Fetch essential agreement parameters
      this.api.serverRequest(request_payload, "FETCH_AGREEMENT_ITEM").then(response => this.item_item_params = response);
      this.api.serverRequest(request_payload, "FETCH_AGREEMENT_TERMS").then(response => this.item_terms = response[0]);
      this.api.serverRequest(request_payload, "FETCH_ADDRESS_EVENTS").then(response => this.agreement_events = response);

      //If the agreement is resolved, fetch clerk decision
      if (response.state == 'RESOLVED') {
        this.api.serverRequest(request_payload, "FETCH_CLERK_DECISION").then(response => {
          this.clerk_decision = response;
          if((this.global.globalvars.account_logged_in == this.item_agreement_params["buyer_id"] && response["buyer_confirm"] == '1') ||
            (this.global.globalvars.account_logged_in == this.item_agreement_params["seller_id"] && response["seller_confirm"] == '1')) {
            this.clerk_confirmed = true;
          } else {
            this.clerk_confirmed = false;
          }
        });
      }

      //Fetch essential logistics parameters
      this.api.serverRequest({agreement_id: this.agreement_id, direction: this.direction}, "FETCH_LOGISTICS_PARAMETERS").then(response => {
        this.logistics_params = response;
        this.api.serverRequest({kolli_id: this.logistics_params.kolli_id}, "FETCH_SIMULATION_SENSORS").then(data => {
          if (this.sensor_selection == null) {
            this.sensor_selection = data;
            this.setCharts(data);
          }
        });
      });
    });
  };

  /**
   * Sets sensor charts
   *
   * @param sensors Sensors, associated with the transfer
   */
  setCharts = function(sensors) {
    //Fetch sensors and assign the data to charts
    for (let sensor of sensors) {
      if (sensor.sensor_type === 'ACC') {
        this.accelerometer_sensor_id = sensor.sensor_id;
        this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
          let time = 0;
          for (let output of data) {
            let step = {'acc': output.output, 'time': time};
            console.log(step);
            this.amCharts.updateChart(this.accChart, () => {this.accChart.dataProvider.push(step);});
            time += this.time_step;
          }
        });
      } else if (sensor.sensor_type === 'PRES') {
        this.pressure_sensor_id = sensor.sensor_id;
        this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
          let time = 0;
          for (let output of data) {
            let step = {'press': output.output, 'time': time};
            console.log(step);
            this.amCharts.updateChart(this.pressChart, () => {this.pressChart.dataProvider.push(step);});
            time += this.time_step;
          }
        });
      } else if (sensor.sensor_type === 'TEMP') {
        this.temperature_sensor_id = sensor.sensor_id;
        this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
          let time = 0;
          for (let output of data) {
            let step = {'temp': output.output, 'time': time};
            this.amCharts.updateChart(this.tempChart, () => {this.tempChart.dataProvider.push(step);});
            time += this.time_step;
          }
        });
      } else if (sensor.sensor_type === 'HUMID') {
        this.humidity_sensor_id = sensor.sensor_id;
        this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
          let time = 0;
          for (let output of data) {
            let step = {'humidity': output.output, 'time': time};
            console.log(step);
            this.amCharts.updateChart(this.humidityChart, () => {this.humidityChart.dataProvider.push(step);});
            time += this.time_step;
          }
        });
      } else if (sensor.sensor_type === 'GPS') {
        this.gps_sensor_id = sensor.sensor_id;
        this.api.serverRequest({gps_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
          this.current_location.lat = parseFloat(data[0].latitude);
          this.current_location.lng = parseFloat(data[0].longitude);
        });
      }
    }
  }

  /**
   * Accepts the delivery.
   */
  acceptItem = function () {
    this.api.serverRequest({agreement_id: this.agreement_id, state: "COMPLETED"}, "ALTER_STATE").then();
    this.router.navigate(['itemmanager', 'history']);
  };

  /**
   * Rejects the delivery.
   */
  rejectItem = function () {
    this.api.serverRequest({agreement_id: this.agreement_id, state: "REJECTED"}, "ALTER_STATE").then();
    this.router.navigate(['itemmanager', 'bought']);
  };

  /**
   * Accepts the return.
   */
  acceptReturn = function () {
    this.api.serverRequest({agreement_id: this.agreement_id, state: "INACTIVE"}, "ALTER_STATE").then();
    this.router.navigate(['itemmanager', 'history']);
  };

  /**
   * Rejects the return.
   */
  rejectReturn = function () {
    this.api.serverRequest({agreement_id: this.agreement_id, state: "CLERK"}, "ALTER_STATE").then();
    this.router.navigate(['itemmanager', 'adverts']);
  };

  /**
   * Redirects to ExplorerComponent with a given address as a parameter.
   *
   * @param address Address to explore.
   */
  exploreAddress = function (address) {
    this.router.navigate(['explorer', address]);
  };

  /**
   * Confirms clerk's decision.
   */
  confirmClerk = function() {
    let request_payload = {agreement_id: this.agreement_id, account_id: this.global.globalvars.account_logged_in};
    this.api.serverRequest(request_payload, "CONFIRM_CLERK_DECISION").then(data => this.clerk_confirmed = true);
  }
}
