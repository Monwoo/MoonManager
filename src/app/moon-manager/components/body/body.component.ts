// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Timing } from '../../api/data-model/timing';
// import * as ExpScroll
// from '@angular/cdk-experimental/scrolling//typings/auto-size-virtual-scroll';
// import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
// import { I18n } from '@ngx-translate/i18n-polyfill';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { I18nService } from '@app/core';
import { ConfigType, configDefaults } from '../../services/config-form.model';
import { TimingsBufferService } from '@app/moon-manager/services/timings-buffer.service';
import { LoadingLoaderService } from '../../services/loading-loader.service';

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
  private config: ConfigType = null;
  public pendingFilteredDatas: Timing[] = [];
  // public filteredDatas: Timing[] = [];
  public filteredDatasAsync: BehaviorSubject<Timing[]> = new BehaviorSubject<Timing[]>([]);
  // public bodyTitle: string = this.i18n('This is a test {{myVar}} !', { myVar: '^_^' });
  constructor(
    private storage: LocalStorage,
    public i18nService: I18nService,
    public timings: TimingsBufferService,
    private ll: LoadingLoaderService
  ) {
    configDefaults(this).then((cDef: ConfigType) => {
      this.config = cDef;
      const selector = 'services';
      this.storage.getItem<any>('config', {}).subscribe(
        (globalConfig: any) => {
          // Called if data is valid or null
          if (!globalConfig) globalConfig = {};
          if (typeof globalConfig[selector] === 'undefined') {
            // globalConfig[selector] = this.config;
          } else {
            this.config = { ...this.config, ...globalConfig[selector] };
          }
          console.log(selector + ' Fetching config : ', this.config);
          this.filteredDatasAsync.next(this.timings.get().slice());
          // this.storage.setItem('config', globalConfig).subscribe(() => {});
          if (this.config.saveTimingsToLocalStorage) {
            // TODO : work in progress, use code below inside TimingsBufferService ? :
            // To much constraints over availables storage spaces for now...
            // this.storage.getItem<any>('timings', []).subscribe((ms: Timing[]) => {
            //   ms = ms ? ms : [];
            //   this.filteredDatas = ms.concat(this.pendingFilteredDatas);
            //   this.pendingFilteredDatas = [];
            //   this.storage.setItem('timings', this.filteredDatas);
            //   this.filteredDatasAsync.next(this.filteredDatas.slice());
            //   // new Map([...this.dataUrls, ...ms]);
            // });
          }
        },
        error => {
          console.error('Fail to fetch config');
        }
      );
    });
  }

  ngOnInit() {
    this.ll.hideLoader();
  }

  didFetchTiming(t: any) {
    // console.log('Did fetch : ', t);
    let index = null;
    if (!this.config) {
      this.pendingFilteredDatas.push(t);
    } else {
      this.timings.get().push(t);
      // TODO : buffer system ? may be too much to save on EACH imported pict, may bulk it ?
      this.filteredDatasAsync.next(this.timings.get().slice());
      if (this.config.saveTimingsToLocalStorage) {
        // TODO : buffer system ? may be too much to save on EACH imported pict, may bulk it ?
        // will see with 2000 pict how it goes...
        // this.storage.setItem('medias-buffer', JSON.stringify(this.dataUrls.entries()));
        // TODO : inside TimingsBuffer service if accruate : this.storage.setItem('timings', this.filteredDatas);
      }
    }
  }
}
