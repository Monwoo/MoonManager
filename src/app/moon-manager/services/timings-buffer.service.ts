// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com
import { Injectable } from '@angular/core';
import { Timing } from '../api/data-model/timing';

@Injectable({
  providedIn: 'root'
})
export class TimingsBufferService {
  dataTimings: Timing[] = [];

  constructor() {}

  hasChanges() {
    // TODO : async way if comes up to it with improved localSorage or remoteStorage system
    return this.dataTimings.length > 0;
  }

  get() {
    return this.dataTimings;
  }

  set(datas: Timing[]) {
    this.dataTimings = datas;
  }
}
