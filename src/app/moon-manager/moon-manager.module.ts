// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoonManagerRoutingModule } from './moon-manager-routing.module';
import { MoonManagerComponent } from './moon-manager.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';

@NgModule({
  declarations: [MoonManagerComponent, FooterComponent, HeaderComponent, BodyComponent],
  imports: [CommonModule, MoonManagerRoutingModule]
})
export class MoonManagerModule {}
