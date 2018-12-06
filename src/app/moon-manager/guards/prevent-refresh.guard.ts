// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Injectable, HostListener } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PreventRefreshInterfaceGuard } from './prevent-refresh-interface.guard';
import { MediasBufferService } from '../services/medias-buffer.service';
import { TimingsBufferService } from '../services/timings-buffer.service';

@Injectable({
  providedIn: 'root'
})
export class PreventRefreshGuard extends PreventRefreshInterfaceGuard {
  constructor(private medias: MediasBufferService, public timings: TimingsBufferService) {
    super();
  }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //     return true;
  // }

  canDeactivate(): boolean {
    let allow = !this.medias.hasChanges() && !this.timings.hasChanges();
    if (!allow) {
      // Message shown when switching routes, but for page refresh, no way found yet,
      // check PreventRefreshInterfaceGuard
      let msg = 'Refreshing this page will wipe out all data. Do you have your backup ?'; //this.i18nService.translate()
      allow = confirm(msg); // Will warn user if wana change from INSIDE app routes not tagged with right guard
    }
    return allow;
  }
}
