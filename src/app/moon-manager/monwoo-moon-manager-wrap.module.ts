// Core imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Items imports
import { MatButtonModule, MatTooltipModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
// import { PanelModule } from 'primeng/primeng';
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
  ],
  exports: [
    MoonManagerComponent,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    FlexLayoutModule
    // PanelModule,
  ]
})
export class MonwooMoonManagerWrapModule {}
