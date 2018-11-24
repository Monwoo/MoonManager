// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit } from '@angular/core';
import { extract } from '../../../core/i18n.service';

@Component({
  selector: 'moon-manager-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // TODO : from centralized config or realtime data storage ?
  appTitle = extract('Moon Manager');

  constructor() {}

  ngOnInit() {}

  goToParameters(e: any) {
    // TODO : param page + link to it...
  }
}
