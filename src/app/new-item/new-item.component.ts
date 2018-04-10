import { Component, OnInit } from '@angular/core';
import { GenerationService } from '../services/generation.service';
import { ApiService } from '../services/api.service';
import { GlobalvarsService } from '../services/globalvars.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

  item_id = "";
  item_title = "";
  item_description = "";
  item_image = "";

  item_defined = false;

  terms_id = "";
  terms_price = 0;
  terms_shipmentdeadline = 48;

  terms_accelerometer = false;
  terms_pressure = false;
  terms_humidity = false;
  terms_temperature = false;
  terms_gps = false;

  sensor_pressure_low = null; sensor_pressure_high = null;
  sensor_humidity_low = null; sensor_humidity_high = null;
  sensor_temperature_low = null; sensor_temperature_high = null;
  sensor_accelerometer = null;


  constructor(private generator: GenerationService, private api: ApiService, private global: GlobalvarsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.item_id = this.generator.generate160bitId();
    this.terms_id = this.generator.generate160bitId();
    this.global.globalvars.current_component = "newitem";
  }

  addNewItem = function() {
    let request_payload = {
      id: this.item_id,
      title: this.item_title,
      description: this.item_description,
      image: this.item_image,
      account: this.global.globalvars.account_logged_in,
      time: this.generator.generateCurrentTime(),
      terms_price: this.terms_price,
      terms_id: this.terms_id,
      image_id: this.generator.generate160bitId(),
      terms_shipmenttime: this.terms_shipmentdeadline,
      sensor_pressure_low: this.sensor_pressure_low,
      sensor_pressure_high: this.sensor_pressure_high,
      sensor_humidity_low: this.sensor_humidity_low,
      sensor_humidity_high: this.sensor_humidity_high,
      sensor_temperature_low: this.sensor_temperature_low,
      sensor_temperature_high: this.sensor_temperature_high,
      sensor_accelerometer: this.sensor_accelerometer,
      sensor_gps: this.terms_gps
    };
    this.api.serverRequest(request_payload, "NEW_ITEM").then(data => {
      this.router.navigate(['items'])
    });
  };
}



