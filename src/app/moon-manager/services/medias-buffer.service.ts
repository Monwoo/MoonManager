// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { I18nService } from '@app/core';
import { ConfigType, configDefaults } from './config-form.model';

@Injectable({
  providedIn: 'root'
})
export class MediasBufferService {
  dataUrls: Map<string, string> = new Map();
  pendingDataUrls: Map<string, string> = new Map();
  config: ConfigType = null;
  // TODO : allow save option for local storage, to let user found back previously proceed medias...
  constructor(private storage: LocalStorage, public i18nService: I18nService) {
    configDefaults(this).then(cDef => {
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
          // this.storage.setItem('config', globalConfig).subscribe(() => {});
          if (this.config.saveMediasToLocalStorage) {
            this.storage.getItem<any>('medias-buffer', {}).subscribe((msArr: any) => {
              const ms: Map<string, string> = msArr ? new Map(msArr) : new Map();
              this.pendingDataUrls.forEach((v, k) => {
                let index = 'moon-manager://dataUrl/' + ms.size.toString();
                ms.set(index, v);
              });
              this.pendingDataUrls.clear; // TODO : what if error in storage set ? will lose data for now...
              this.dataUrls = ms;
              this.storage.setItem('medias-buffer', [...ms]);
              // new Map([...this.dataUrls, ...ms]);
            });
          }
        },
        error => {
          console.error('Fail to fetch config');
        }
      );
    });
  }

  clear() {
    this.dataUrls.clear();
  }

  pushDataUrlMedia(dataUrl: string) {
    let index = null;
    if (!this.config) {
      index = 'moon-manager://dataUrl/' + this.pendingDataUrls.size.toString();
      this.pendingDataUrls.set(index, dataUrl);
    } else {
      index = 'moon-manager://dataUrl/' + this.dataUrls.size.toString();
      this.dataUrls.set(index, dataUrl);
      if (this.config.saveMediasToLocalStorage) {
        // TODO : buffer system ? may be too much to save on EACH imported pict, may bulk it ?
        // will see with 2000 pict how it goes...
        // this.storage.setItem('medias-buffer', JSON.stringify(this.dataUrls.entries()));
        this.storage.setItem('medias-buffer', [...this.dataUrls]);
      }
    }

    return index;
  }

  getDataUrlMedia(index: string) {
    return this.dataUrls.get(index);
  }
}
