// Core imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Items imports
import { MatButtonModule } from '@angular/material';
// Local source codes imports
import { MoonManagerComponent } from './moon-manager.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [MoonManagerComponent, HeaderComponent, FooterComponent],
  imports: [CommonModule, RouterModule, MatButtonModule],
  exports: [MoonManagerComponent, MatButtonModule]
})
export class MonwooMoonManagerWrapModule {}
