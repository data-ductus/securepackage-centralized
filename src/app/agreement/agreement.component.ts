import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GenerationService} from '../services/generation.service';
import {ApiService} from '../services/api.service';
import {GlobalvarsService} from '../services/globalvars.service';
import {AmChartsService, AmChart} from '@amcharts/amcharts3-angular';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {
  agreement_id;

  stepDuration = 120;

  current_location = {
    lat: 24.799448,
    lng: 120.979021,
  };

  item_agreement_params;
  item_item_params;
  item_terms;

  logistics_params;
  agreement_events;

  private tempChart: AmChart;
  private pressChart: AmChart;
  private accChart: AmChart;
  private humidityChart: AmChart;

  time = [];
  tempData = [];
  accData = [];
  pressData = [];
  humidityData = [];
  currentPosition;
  direction;

  accelerometer_sensor_id = null;
  pressure_sensor_id = null;
  temperature_sensor_id = null;
  humidity_sensor_id = null;
  gps_sensor_id = null;

  sensor_pressure_low = null; sensor_pressure_high = null;
  sensor_humidity_low = null; sensor_humidity_high = null;
  sensor_temperature_low = null; sensor_temperature_high = null;
  sensor_accelerometer = null;

  show_sensors = false;
  show_gps = false;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, private generator: GenerationService, private global: GlobalvarsService, private amCharts: AmChartsService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.agreement_id = params['id'];
      this.initCharts();
      this.fetchAgreementDetails();
    });
  }

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

  fetchAgreementDetails = function () {
    let request_payload = {id: this.agreement_id, status: "ACCEPTED"};
    this.api.serverRequest(request_payload, "FETCH_AGREEMENT_INFO").then(response => {
      this.item_agreement_params = response;
      if (this.item_agreement_params.state == "TRANSIT" || this.item_agreement_params.state == "DELIVERED") {
        this.direction = "TRANSFER";
      }
      else if (this.item_agreement_params.state == "RETURN" || this.item_agreement_params.state == "RETURNED") {
        this.direction = "RETURN";
      }
      this.api.serverRequest(request_payload, "FETCH_AGREEMENT_ITEM").then(response => this.item_item_params = response);
      this.api.serverRequest(request_payload, "FETCH_AGREEMENT_TERMS").then(response => this.item_terms = response[0]);
      this.api.serverRequest(request_payload, "FETCH_ADDRESS_EVENTS").then(response => this.agreement_events = response);

      this.api.serverRequest({agreement_id: this.agreement_id, direction: this.direction}, "FETCH_LOGISTICS_PARAMETERS").then(response => {
        this.logistics_params = response;
        this.api.serverRequest({kolli_id: this.logistics_params.kolli_id}, "FETCH_SIMULATION_SENSORS").then(data => {
          for (let sensor of data) {
            if (sensor.sensor_type === 'ACC') {
              this.accelerometer_sensor_id = sensor.sensor_id;
              this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                let time = 0;
                for (let output of data) {
                  let step = {'acc': output.output, 'time': time};
                  console.log(step);
                  this.amCharts.updateChart(this.accChart, () => {this.accChart.dataProvider.push(step);});
                  time += 120;
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
                  time += 120;
                }
              });
            } else if (sensor.sensor_type === 'TEMP') {
              this.temperature_sensor_id = sensor.sensor_id;
              this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                let time = 0;
                for (let output of data) {
                  let step = {'temp': output.output, 'time': time};
                  console.log(step);
                  this.amCharts.updateChart(this.tempChart, () => {this.tempChart.dataProvider.push(step);});
                  time += 120;
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
                  time += 120;
                }
              });
            } else if (sensor.sensor_type === 'GPS') {
              this.gps_sensor_id = sensor.sensor_id;
              this.api.serverRequest({gps_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                this.current_location.lat = parseFloat(data[0].latitude);
                this.current_location.lng = parseFloat(data[0].longitude);
                console.log(this.current_location);
              });
            }
          }
        });
      });

    });
  };

  acceptItem = function () {
    this.api.serverRequest({agreement_id: this.agreement_id, state: "COMPLETED"}, "ALTER_STATE").then();
    this.router.navigate(['itemmanager', 'bought']);
  };

  rejectItem = function () {
    this.api.serverRequest({agreement_id: this.agreement_id, state: "REJECTED"}, "ALTER_STATE").then();
    this.router.navigate(['itemmanager', 'bought']);
  };

  acceptReturn = function () {
    this.api.serverRequest({agreement_id: this.agreement_id, state: "INACTIVE"}, "ALTER_STATE").then();
    this.router.navigate(['itemmanager', 'bought']);
  };

  rejectReturn = function () {
    this.api.serverRequest({agreement_id: this.agreement_id, state: "CLERK"}, "ALTER_STATE").then();
    this.router.navigate(['itemmanager', 'bought']);
  };

  explore_address = function (address) {
    this.router.navigate(['explorer', address]);
  }
}
