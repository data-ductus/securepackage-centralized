import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalvarsService} from '../services/globalvars.service';
import {ApiService} from '../services/api.service';
import {AmChart, AmChartsService} from '@amcharts/amcharts3-angular';

@Component({selector: 'app-clerk', templateUrl: './clerk.component.html'})

export class ClerkComponent implements OnInit {

  address;

  clerk_id = "admin"; //For testing
  clerk_password = "admin"; //For testing

  //List of clerk agreements
  clerk_agreements;
  clerk_resolved_agreements;

  //Agreement parameters
  agreement_details;
  agreement_seller_details;
  agreement_buyer_details;
  agreement_events;
  agreement_terms;
  agreement_resolvement;

  //Booleans for chart and table display
  show_delivery = false;
  show_return = false;
  show_events = false;

  // Ligistics parameters
  logistics_delivery_parameters;
  logistics_return_parameters;

  time = [];
  time_step = 120;

  //Delivery chart data
  deliveryTempData = [];
  deliveryAccData = [];
  deliveryPressData = [];
  deliveryHumidityData = [];

  //Return chart data
  returnTempData = [];
  returnAccData = [];
  returnPressData = [];
  returnHumidityData = [];

  //Sensor inclusion
  delivery_accelerometer_sensor_id = null;
  delivery_pressure_sensor_id = null;
  delivery_temperature_sensor_id = null;
  delivery_humidity_sensor_id = null;
  delivery_gps_sensor_id = null;

  //Sensor inclusion
  return_accelerometer_sensor_id = null;
  return_pressure_sensor_id = null;
  return_temperature_sensor_id = null;
  return_humidity_sensor_id = null;
  return_gps_sensor_id = null;

  //Delivery charts declaration
  private deliveryTempChart: AmChart;
  private deliveryPressChart: AmChart;
  private deliveryAccChart: AmChart;
  private deliveryHumidityChart: AmChart;

  //Return charts declaration
  private returnTempChart: AmChart;
  private returnPressChart: AmChart;
  private returnAccChart: AmChart;
  private returnHumidityChart: AmChart;

  //Resolving variables
  liable_party = "BUYER";
  resolve_message;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private global: GlobalvarsService, private amCharts: AmChartsService) { }

  ngOnInit() {
    this.global.changeMenu(null);
    this.initDeliveryCharts();
    this.initReturnCharts();
    this.api.serverRequest({}, "FETCH_CLERK_AGREEMENTS").then(data => this.clerk_agreements = data);
    this.api.serverRequest({}, "FETCH_RESOLVED_AGREEMENTS").then(data => this.clerk_resolved_agreements = data);
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.address = params['id'];
        this.api.serverRequest({id: this.address}, "FETCH_ADDRESS"). then(data => {
          this.agreement_details = data["payload"];
          this.api.serverRequest({id: this.address}, "FETCH_CLERK_DECISION").then(response => {this.agreement_resolvement = response});
          this.api.serverRequest({account_id: this.agreement_details["buyer_id"]}, "FETCH_ACCOUNT").then(data => this.agreement_buyer_details = data);
          this.api.serverRequest({account_id: this.agreement_details["seller_id"]}, "FETCH_ACCOUNT").then(data => this.agreement_seller_details = data);
          this.api.serverRequest({id: this.address}, "FETCH_ADDRESS_EVENTS").then(data => this.agreement_events = data);
          this.api.serverRequest({id: this.address}, "FETCH_CURRENT_AGREEMENT_TERMS").then(response => this.agreement_terms = response);
          this.api.serverRequest({agreement_id: this.address, direction: 'TRANSFER'}, "FETCH_LOGISTICS_PARAMETERS").then(data => {
            this.logistics_delivery_parameters = data;
            this.api.serverRequest({kolli_id: this.logistics_delivery_parameters.kolli_id}, "FETCH_SIMULATION_SENSORS").then(data => {

              //Fetch sensors and assign the data to charts
              for (let sensor of data) {
                if (sensor.sensor_type === 'ACC') {
                  this.delivery_accelerometer_sensor_id = sensor.sensor_id;
                  this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                    let time = 0;
                    for (let output of data) {
                      let step = {'acc': output.output, 'time': time};
                      this.amCharts.updateChart(this.deliveryAccChart, () => {this.deliveryAccChart.dataProvider.push(step);});
                      time += this.time_step;
                    }
                  });
                } else if (sensor.sensor_type === 'PRES') {
                  this.delivery_pressure_sensor_id = sensor.sensor_id;
                  this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                    let time = 0;
                    for (let output of data) {
                      let step = {'press': output.output, 'time': time};
                      this.amCharts.updateChart(this.deliveryPressChart, () => {this.deliveryPressChart.dataProvider.push(step);});
                      time += this.time_step;
                    }
                  });
                } else if (sensor.sensor_type === 'TEMP') {
                  this.delivery_temperature_sensor_id = sensor.sensor_id;
                  this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                    let time = 0;
                    for (let output of data) {
                      let step = {'temp': output.output, 'time': time};
                      this.amCharts.updateChart(this.deliveryTempChart, () => {this.deliveryTempChart.dataProvider.push(step);});
                      time += this.time_step;
                    }
                  });
                } else if (sensor.sensor_type === 'HUMID') {
                  this.delivery_humidity_sensor_id = sensor.sensor_id;
                  this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                    let time = 0;
                    for (let output of data) {
                      let step = {'humidity': output.output, 'time': time};
                      this.amCharts.updateChart(this.deliveryHumidityChart, () => {this.deliveryHumidityChart.dataProvider.push(step);});
                      time += this.time_step;
                    }
                  });
                } else if (sensor.sensor_type === 'GPS') {
                  this.delivery_gps_sensor_id = sensor.sensor_id;
                }
              }
            });
          });
          this.api.serverRequest({agreement_id: this.address, direction: 'RETURN'}, "FETCH_LOGISTICS_PARAMETERS").then(data => {
            this.logistics_return_parameters = data;

            this.api.serverRequest({kolli_id: this.logistics_return_parameters.kolli_id}, "FETCH_SIMULATION_SENSORS").then(data => {

              //Fetch sensors and assign the data to charts
              for (let sensor of data) {
                if (sensor.sensor_type === 'ACC') {
                  this.return_accelerometer_sensor_id = sensor.sensor_id;
                  this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                    let time = 0;
                    for (let output of data) {
                      let step = {'acc': output.output, 'time': time};
                      this.amCharts.updateChart(this.returnAccChart, () => {this.returnAccChart.dataProvider.push(step);});
                      time += this.time_step;
                    }
                  });
                } else if (sensor.sensor_type === 'PRES') {
                  this.return_pressure_sensor_id = sensor.sensor_id;
                  this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                    let time = 0;
                    for (let output of data) {
                      let step = {'press': output.output, 'time': time};
                      this.amCharts.updateChart(this.returnPressChart, () => {this.returnPressChart.dataProvider.push(step);});
                      time += this.time_step;
                    }
                  });
                } else if (sensor.sensor_type === 'TEMP') {
                  this.return_temperature_sensor_id = sensor.sensor_id;
                  this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                    let time = 0;
                    for (let output of data) {
                      let step = {'temp': output.output, 'time': time};
                      this.amCharts.updateChart(this.returnTempChart, () => {this.returnTempChart.dataProvider.push(step);});
                      time += this.time_step;
                    }
                  });
                } else if (sensor.sensor_type === 'HUMID') {
                  this.return_humidity_sensor_id = sensor.sensor_id;
                  this.api.serverRequest({sensor_id: sensor.sensor_id}, "FETCH_SENSOR_DATA").then(data => {
                    let sensord = data;
                    let time = 0;
                    for (let output of data) {
                      let step = {'humidity': output.output, 'time': time};
                      this.amCharts.updateChart(this.returnHumidityChart, () => {this.returnHumidityChart.dataProvider.push(step);});
                      time += this.time_step;
                    }
                  });
                } else if (sensor.sensor_type === 'GPS') {
                  this.return_gps_sensor_id = sensor.sensor_id;
                }
              }
            });
          });
        });
      }
    });
  }

  clerkLogin = function() {
    let request_payload = {address: this.clerk_id, password: this.clerk_password};
    this.api.serverRequest(request_payload, "CLERK_LOGIN").then(userdata => {
      if (userdata != null) { this.global.globalvars.clerk_logged_in = this.clerk_id }
    });
  };

  exploreAddress = function(address) {
    this.router.navigate(['explorer', address]);
  };

  manageConflict = function(address) {
    this.router.navigate(['clerk', address]);
  };

  initDeliveryCharts = function() {
    this.deliveryTempChart = this.amCharts.makeChart( 'deliveryTempChartDiv', {
      'type': 'serial',
      'dataProvider': this.deliveryTempData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'temp',
        'type': 'column'
      } ]
    } );
    this.deliveryPressChart = this.amCharts.makeChart( 'deliveryPressChartDiv', {
      'type': 'serial',
      'dataProvider': this.deliveryPressData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'press',
        'type': 'column'
      } ]
    } );
    this.deliveryAccChart = this.amCharts.makeChart( 'deliveryAccChartDiv', {
      'type': 'serial',
      'dataProvider': this.deliveryAccData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'acc',
        'type': 'column'
      } ]
    } );
    this.deliveryHumidityChart = this.amCharts.makeChart( 'deliveryHumidityChartDiv', {
      'type': 'serial',
      'dataProvider': this.deliveryHumidityData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'humidity',
        'type': 'column'
      } ]
    } );
  };

  initReturnCharts = function() {
    this.returnTempChart = this.amCharts.makeChart( 'returnTempChartDiv', {
      'type': 'serial',
      'dataProvider': this.deliveryTempData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'temp',
        'type': 'column'
      } ]
    } );
    this.returnPressChart = this.amCharts.makeChart( 'returnPressChartDiv', {
      'type': 'serial',
      'dataProvider': this.returnPressData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'press',
        'type': 'column'
      } ]
    } );
    this.returnAccChart = this.amCharts.makeChart( 'returnAccChartDiv', {
      'type': 'serial',
      'dataProvider': this.returnAccData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'acc',
        'type': 'column'
      } ]
    } );
    this.returnHumidityChart = this.amCharts.makeChart( 'returnHumidityChartDiv', {
      'type': 'serial',
      'dataProvider': this.returnHumidityData,
      'categoryField': 'time',
      'graphs': [ {
        'valueField': 'humidity',
        'type': 'column'
      } ]
    } );
  };

  resolveConflict = function() {
    let request_payload = {id: this.address, liable_party: this.liable_party, message: this.resolve_message, clerk_id: this.global.globalvars.clerk_logged_in};
    this.api.serverRequest(request_payload, "RESOLVE_CONFLICT").then(data => this.router.navigate(["clerk"]));
  }
}
