// Core imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Items imports
import { MatButtonModule, MatTooltipModule } from '@angular/material';
import { MatCardModule } from '@angular/material';

// TODO : try to combine Material and PrimeNg, failing import about splitbutton for now...
// import { PanelModule } from 'primeng/primeng';
// import {SplitButtonModule} from 'primeng/splitbutton';
// import {SplitButtonModule} from 'primeng/splitbutton';
// import {TreeTableModule} from 'primeng/treetable';
// import { PanelModule } from 'primeng/panel';

import { FlexLayoutModule } from '@angular/flex-layout';

// Local source codes imports
import { MoonManagerComponent } from './moon-manager.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  declarations: [MoonManagerComponent, HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    RouterModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    FlexLayoutModule
    // PanelModule,
    // TreeTableModule,
    // SplitButtonModule,
  ],
  exports: [
    MoonManagerComponent,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    FlexLayoutModule
    // PanelModule,
    // TreeTableModule,
    // SplitButtonModule,
  ]
})
export class MonwooMoonManagerWrapModule {}
