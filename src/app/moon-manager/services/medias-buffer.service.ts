// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Injectable } from '@angular/core';
import { I18nService } from '@app/core';
import { ConfigType, configDefaults } from './config-form.model';
import { LocalStorage } from '@ngx-pwa/local-storage';
// TODO : find polyfill lib for webworkers caches :
// https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/cache-api
// const cacheAvailable = 'caches' in window;
const Caches = window.caches;

@Injectable({
  providedIn: 'root'
})
export class MediasBufferService {
  dataUrls: Map<string, string> = new Map();
  pendingDataUrls: Map<string, string> = new Map();
  // pendingFetches: Set<Promise<string>> = new Set();
  pendingFetches: [string, any, any][] = [];
  mediaCache: any = null;
  config: ConfigType = null;
  // TODO : allow save option for local storage, to let user found back previously proceed medias...
  constructor(private storage: LocalStorage, public i18nService: I18nService) {
    this.refreshSettings();
  }

  // Services are not reloaded on page change, opposit to components, so need
  // to manually call refreshSetting or have better listener system over config changes...
  refreshSettings() {
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
            Caches.open('medias-buffer').then(cache => {
              this.mediaCache = cache;
              this.pendingDataUrls.forEach((v, k) => {
                this.mediaCache.keys().then((cacheKeys: []) => {
                  let index = '/cache/moon-manager/dataUrl/' + cacheKeys.length.toString();
                  this.mediaCache.put(index, new Response(v));
                });
              });
              this.pendingDataUrls.clear(); // TODO : what if error in storage set ? will lose data for now...
              // TODO : should await all above cache put before checking pendings fetches ?

              // TODO : async mutext etc ??? simple while for now, hopping for no clash...
              while (this.pendingFetches.length) {
                const pending = this.pendingFetches.pop();
                const [index, resolve, reject] = pending;
                this.mediaCache
                  .match(index)
                  .then((r: Response) => {
                    if (r) {
                      console.log('Pending resolved for :', index);
                      resolve(r.text);
                    } else {
                      console.warn('Pending fail lookup for :', index);
                      resolve(null);
                      // reject('Pending fail lookup for : ' + index);
                    }
                  })
                  .catch((e: any) => {
                    console.error('Pending error for :', index, e);
                    Promise.reject(e);
                  });
              }
            });
            // this.storage.getItem<any>('medias-buffer', {}).subscribe((msArr: any) => {
            //   const ms: Map<string, string> = msArr ? new Map(msArr) : new Map();
            //   this.pendingDataUrls.forEach((v, k) => {
            //     let index = 'moon-manager://dataUrl/' + ms.size.toString();
            //     ms.set(index, v);
            //   });
            //   this.pendingDataUrls.clear; // TODO : what if error in storage set ? will lose data for now...
            //   this.dataUrls = ms;
            //   this.storage.setItem('medias-buffer', [...ms]);
            //   // new Map([...this.dataUrls, ...ms]);
            // });
          } else {
            this.pendingDataUrls.forEach((v, k) => {
              let index = '/cache/moon-manager/dataUrl/' + this.dataUrls.size.toString();
              this.dataUrls.set(index, v);
            });
            this.pendingDataUrls.clear; // TODO : what if error in storage set ? will lose data for now...
          }
        },
        error => {
          console.error('Fail to fetch config');
        }
      );
    });
  }

  async clear() {
    if (this.config.saveMediasToLocalStorage) {
      if (this.mediaCache) {
        Caches.delete('medias-buffer').then(succed => {
          console.log('Did clear media cache : ', succed);
        });
      } else {
        console.error('Media cache not yet initialized'); // TODO : return promise to clear on init ? well Quota issue to solve before putting work in not available stuffs...
      }
    } else {
      this.dataUrls.clear();
    }
  }

  async pushDataUrlMedia(dataUrl: string) {
    let index = null;
    if (!this.config) {
      index = '/cache/moon-manager/dataUrl/' + this.pendingDataUrls.size.toString();
      this.pendingDataUrls.set(index, dataUrl);
    } else {
      if (this.config.saveMediasToLocalStorage) {
        const cacheKeys = await this.mediaCache.keys();
        index = '/cache/moon-manager/dataUrl/' + cacheKeys.length.toString();
        // TODO : buffer system ? may be too much to save on EACH imported pict, may bulk it ?
        // will see with 2000 pict how it goes...
        // this.storage.setItem('medias-buffer', JSON.stringify(this.dataUrls.entries()));
        // this.storage.setItem('medias-buffer', [...this.dataUrls]);
        const requestMock = new Request(index, {
          headers: new Headers({
            'Content-Type': 'image/*'
          })
        });

        this.mediaCache.put(requestMock, new Response(dataUrl)).catch((e: any) => {
          console.error(e.message, e); // TODO : config issue ? always give QuotaExced ERROR
        });
      } else {
        index = '/cache/moon-manager/dataUrl/' + this.dataUrls.size.toString();
        this.dataUrls.set(index, dataUrl);
      }
    }

    return index;
  }

  async getDataUrlMedia(index: string) {
    if (this.config.saveMediasToLocalStorage) {
      if (!this.mediaCache) {
        const pending = new Promise<string>((resolve, reject) => {
          const pendingSize = this.pendingFetches.length;
          // TODO : should await this.mediaCache change from null...
          // https://stackoverflow.com/questions/49552258/how-to-listen-for-value-changes-from-class-property-typescript-angular-5
          console.log('Media Cache not initialized for ', index, '. Pending task...');
          this.pendingFetches.push([index, resolve, reject]);
        });
        return await pending;
      }
      await this.mediaCache.match(index);
    } else {
      return this.dataUrls.get(index);
    }
  }
}
