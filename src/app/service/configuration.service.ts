import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(public http: HttpClient) { }

  getConf(){
    return this.http.get("assets/config/conf.json");
  }
}
