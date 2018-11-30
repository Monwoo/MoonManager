// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Timing } from '../../api/data-model/timing';
// import * as ExpScroll
// from '@angular/cdk-experimental/scrolling//typings/auto-size-virtual-scroll';
// import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';

@Component({
  selector: 'moon-manager-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
  // providers: [
  //   {
  //     provide: VIRTUAL_SCROLL_STRATEGY,
  //     useClass: <any>ExpScroll.AutoSizeVirtualScrollStrategy
  //   }
  // ],
})
export class BodyComponent implements OnInit {
  public filteredDatas: Timing[] = [];
  public filteredDatasAsync: BehaviorSubject<Timing[]> = new BehaviorSubject<Timing[]>([]);
  constructor() {}

  ngOnInit() {}

  didFetchTiming(t: any) {
    // console.log('Did fetch : ', t);
    this.filteredDatas.push(t);
    this.filteredDatasAsync.next(this.filteredDatas.slice());
  }
}
