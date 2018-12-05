// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  NgZone
} from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NotificationsService } from 'angular2-notifications';
import { extract } from '@app/core';
import { environment } from '@env/environment';
import { CONFIG_FORM_LAYOUT, configFormModel, paramSelectors } from './config-form.model';
import { DynamicFormModel, DynamicFormLayout, DynamicFormService } from '@ng-dynamic-forms/core';
import { configDefaults as cflDefaults } from '../client-files-loader/config-form.model';
import { configDefaults as pivotDefaults } from '../timing-pivot/config-form.model';
import { I18nService } from '@app/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { BehaviorSubject } from 'rxjs';
import { LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'moon-manager-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('paramsForm') paramsForm: NgForm = null; // TODO : fail to use for now

  // formModel: Promise<DynamicFormModel> = configFormModel(this);
  formModel: DynamicFormModel = null;
  // TODO : how to custom layout for embed form with NO html code ?
  // Need some code pattern to avoid id's clash ?
  formLayout: DynamicFormLayout = CONFIG_FORM_LAYOUT;
  // formGroup: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(new FormGroup({}));
  formGroup: FormGroup = null;

  langPlaceholder: string = extract('Langue');

  // TODO i18n annotation needed OnDemande... realy nice to have simple system,
  // but with below case, translator will not have easy ways to gess right translation...
  indicatorStoryUrl: string = extract('assets/TimingsIndicatorStory.png');

  constructor(
    private ngZone: NgZone,
    private storage: LocalStorage,
    private i18nService: I18nService,
    private notif: NotificationsService,
    private formService: DynamicFormService,
    public i18n: I18n
  ) {}

  public config: any = null;

  updateConfigForm() {
    // this.formModel.then(fm => {
    configFormModel(this).then((fm: DynamicFormModel) => {
      // this.formGroup = new BehaviorSubject(this.formService.createFormGroup(fm));
      this.formModel = fm;
      this.formGroup = this.formService.createFormGroup(this.formModel);

      // Load from params from local storage :
      this.storage.getItem<any>('config', {}).subscribe(
        config => {
          (async () => {
            // Called if data is valid or null
            let freshConf = await this.getFreshConf();
            this.config = { ...freshConf, ...config };
            console.log('Fetching config : ', this.config);
            this.ngZone.run(() => {
              // TODO : solve error :
              // ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'null:
              // Non bloquant : ca fonctionne qd meme....
              this.formGroup.patchValue(this.config);
            });
          })();
        },
        error => {
          console.error('Fail to fetch config');
        }
      );
    });
  }

  ngOnInit() {
    this.updateConfigForm();
    this.i18nService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateConfigForm();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Having changes : ', changes); // binding issue or pb with deep object fail to observe ?
  }

  ngAfterViewInit() {
    // TODO : will not change if live edit in form, pb about form building ?
    // may need to build form structure JS Side ? solved by simple 'save btn' for now...
    // this.paramsForm.form.valueChanges.subscribe(allConfigs => {
    //   console.log('Having changes : ', allConfigs);
    // });
  }
  errorHandler = (error: any) => {
    this.notif.error(extract("Echec de l'enregistrement")); // TODO : tanslations
    console.log(error);
  };
  saveAction(e: any) {
    let changes = this.paramsForm.form.value;
    console.log('Saving changes : ', changes);

    // TODO : better deep objects mappings : reactive forms ?
    // Quick hack for V1 pré-prod below :
    let agFields = changes['moon-manager-timing-pivot'].agregationsFields;
    agFields = typeof agFields === 'string' ? agFields.split(',') : agFields;
    changes['moon-manager-timing-pivot'].agregationsFields = agFields;
    // TODO : ensure array for selected jointure have lenght > 2, or summary is not yet fully right...

    this.storage.getItem<any>('config', {}).subscribe((globalConfig: any) => {
      // Called if data is valid or null
      if (!globalConfig) globalConfig = {};
      this.storage
        .setItem('config', {
          ...globalConfig,
          ...changes
        })
        .subscribe(() => {
          this.notif.success(extract('Changements enregistré')); // TODO : tanslations
        }, this.errorHandler);
    }, this.errorHandler);
  }

  async getFreshConf() {
    return {
      // TODO : refactor => need auto-gen from config-form....
      [paramSelectors[0]]: await cflDefaults(this),
      [paramSelectors[1]]: await pivotDefaults(this)
    };
  }

  resetConfigAction(e: any) {
    // let changes = this.paramsForm.form.value;
    (async () => {
      let freshConf = await this.getFreshConf();
      console.log('Reseting config to : ', freshConf);
      this.storage.clear().subscribe(() => {
        this.updateConfigForm();
        this.notif.success(extract('Nettoyage des paramêtres OK'));
      });
    })();
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
    this.notif.success(extract('Changing language to : ') + extract(language));
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }
}
