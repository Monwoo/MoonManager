// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'moon-manager-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {
  constructor(private storage: LocalStorage) {}

  private config: any;

  ngOnInit() {
    // Load from params from local storage :
    this.storage.getItem<any>('config', {}).subscribe(
      config => {
        // Called if data is valid or null
        console.log('Fetching config : ', config);
        this.config = config;
      },
      error => {
        console.error('Fail to fetch config');
      }
    );
  }
}
