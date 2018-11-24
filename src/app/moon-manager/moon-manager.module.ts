// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoonManagerRoutingModule } from './moon-manager-routing.module';
import { MoonManagerComponent } from './moon-manager.component';

@NgModule({
  declarations: [MoonManagerComponent],
  imports: [CommonModule, MoonManagerRoutingModule]
})
export class MoonManagerModule {}
