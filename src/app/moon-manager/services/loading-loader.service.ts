// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingLoaderService {
  _ll: any = null;
  renderer: Renderer2 = null;
  // discreteTimeout = 3000

  constructor(private rendererFactory: RendererFactory2) // @Inject(DOCUMENT) private document,
  {
    this.renderer = rendererFactory.createRenderer(null, null);
    this._ll = document.querySelector('.loading-loader');
    // this.renderer.listen(ll, 'click', console.log);
  }

  public showLoader() {
    this.renderer.removeClass(this._ll, 'off');
  }

  public hideLoader() {
    this.renderer.addClass(this._ll, 'off');
  }
}
