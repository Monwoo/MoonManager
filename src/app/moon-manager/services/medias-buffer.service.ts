import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class MediasBufferService {
  dataUrls: Map<string, string> = new Map();

  // TODO : allow save option for local storage, to let user found back previously proceed medias...
  constructor(private storage: LocalStorage) {}

  clear() {
    this.dataUrls.clear();
  }

  pushDataUrlMedia(dataUrl: string) {
    let index = 'moon-manager://dataUrl/' + this.dataUrls.size.toString();
    this.dataUrls.set(index, dataUrl);
    return index;
  }

  getDataUrlMedia(index: string) {
    return this.dataUrls.get(index);
  }
}
