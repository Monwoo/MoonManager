// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <== add the imports!
import { MatButtonModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
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
import { TreeTableModule } from 'primeng/primeng';

import { MoonManagerRoutingModule } from './moon-manager-routing.module';
import { BodyComponent } from './components/body/body.component';
import { ClientFilesLoaderComponent } from './components/client-files-loader/client-files-loader.component';
import { TimmingFormComponent } from './components/timming-form/timming-form.component';
import { TimmingPivotComponent } from './components/timming-pivot/timming-pivot.component';

// https://github.com/zefoy/ngx-dropzone-wrapper
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ParametersComponent } from './components/parameters/parameters.component';
import { MonwooMoonManagerWrapModule } from './monwoo-moon-manager-wrap.module';
import { DefaultPipe } from './pipes/default.pipe';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // maxFilesize: 50000,
  // acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [
    BodyComponent,
    ClientFilesLoaderComponent,
    TimmingFormComponent,
    TimmingPivotComponent,
    ParametersComponent,
    DefaultPipe
  ],
  imports: [
    CommonModule,
    MoonManagerRoutingModule,
    DropzoneModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    ScrollingModule,
    PlatformModule,
    TreeTableModule,
    MonwooMoonManagerWrapModule
  ],
  providers: [
    // { provide: LogOpt, useValue: { level: LogLvl.DEBUG } },
    // Logger,
    CurrencyPipe,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]
})
export class MoonManagerModule {}
