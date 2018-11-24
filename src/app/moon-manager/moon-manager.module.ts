// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PlatformModule } from '@angular/cdk/platform';
import { MatCardModule } from '@angular/material';
// TODO : try to integrate nice logger module... or find starter ways...
// import { Logger, Options as LogOpt, Level as LogLvl } from 'angular2-logger/dist/es6/core';
import { CurrencyPipe } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/primeng';

import { MoonManagerRoutingModule } from './moon-manager-routing.module';
import { MoonManagerComponent } from './moon-manager.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';

@NgModule({
  declarations: [MoonManagerComponent, FooterComponent, HeaderComponent, BodyComponent],
  imports: [
    CommonModule,
    MoonManagerRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    ScrollingModule,
    PlatformModule,
    TreeTableModule
  ],
  providers: [
    // { provide: LogOpt, useValue: { level: LogLvl.DEBUG } },
    // Logger,
    CurrencyPipe
  ]
})
export class MoonManagerModule {}
