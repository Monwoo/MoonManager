import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule, createTranslateLoader } from '@app/core';
import { SharedModule } from '@app/shared';
import { MoonManagerModule } from './moon-manager/moon-manager.module';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { I18n, MISSING_TRANSLATION_STRATEGY } from '@ngx-translate/i18n-polyfill';
import { HttpModule, Http } from '@angular/http';
import { TranslateLoader } from '@ngx-translate/core';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    // TODO : move translation deps loadings to shared module ?
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,
    MoonManagerModule,
    HomeModule,
    AboutModule,
    LoginModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  // providers: [I18n],
  bootstrap: [AppComponent]
})
export class AppModule {}
