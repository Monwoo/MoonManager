// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit } from '@angular/core';
import { extract } from '../../../core/i18n.service';

@Component({
  selector: 'moon-manager-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  trans = {
    copyright: {
      text: extract('© Copyright Monwoo 2018, service@monwoo.com, données privées'),
      url: extract('http://www.monwoo.com')
    }
  };

  constructor() {}

  ngOnInit() {}
}
