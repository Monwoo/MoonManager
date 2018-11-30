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
import { CONFIG_FORM_LAYOUT, CONFIG_FORM_MODEL } from './config-form.model';
import { DynamicFormModel, DynamicFormLayout, DynamicFormService } from '@ng-dynamic-forms/core';

@Component({
  selector: 'moon-manager-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('paramsForm') paramsForm: NgForm; // TODO : fail to use for now

  formModel: DynamicFormModel = CONFIG_FORM_MODEL;
  // TODO : how to custom layout for embed form with NO html code ?
  // Need some code pattern to avoid id's clash ?
  formLayout: DynamicFormLayout = CONFIG_FORM_LAYOUT;
  formGroup: FormGroup;

  constructor(
    private ngZone: NgZone,
    private storage: LocalStorage,
    private notif: NotificationsService,
    private formService: DynamicFormService
  ) {}

  public config: any;

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Having changes : ', changes); // binding issue or pb with deep object fail to observe ?
  }

  ngAfterViewInit() {
    // Load from params from local storage :
    this.storage.getItem<any>('config', {}).subscribe(
      config => {
        // Called if data is valid or null
        console.log('Fetching config : ', config);
        this.config = config;
        this.ngZone.run(() => {
          // TODO : solve error :
          // ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'null:
          // Non bloquant : ca fonctionne qd meme....
          this.paramsForm.form.patchValue(this.config);
        });
      },
      error => {
        console.error('Fail to fetch config');
      }
    );

    // TODO : will not change if live edit in form, pb about form building ?
    // may need to build form structure JS Side ? solved by simple 'save btn' for now...
    // this.paramsForm.form.valueChanges.subscribe(allConfigs => {
    //   console.log('Having changes : ', allConfigs);
    // });
  }

  saveAction(e: any) {
    let changes = this.paramsForm.form.value;
    console.log('Saving changes : ', changes);

    // TODO : better deep objects mappings : reactive forms ?
    // Quick hack for V1 pré-prod below :
    let agFields = changes['moon-manager-timing-pivot'].agregationsFields;
    agFields = typeof agFields === 'string' ? agFields.split(',') : agFields;
    changes['moon-manager-timing-pivot'].agregationsFields = agFields;
    // TODO : ensure array for selected jointure have lenght > 2, or summary is not yet fully right...

    let errorHandler = (error: any) => {
      this.notif.error("Echec de l'enregistrement"); // TODO : tanslations
      console.log(error);
    };

    this.storage.getItem<any>('config', {}).subscribe((globalConfig: any) => {
      // Called if data is valid or null
      if (!globalConfig) globalConfig = {};
      this.storage
        .setItem('config', {
          ...globalConfig,
          ...changes
        })
        .subscribe(() => {
          this.notif.success('Changements enregistré'); // TODO : tanslations
        }, errorHandler);
    }, errorHandler);
  }

  resetConfigAction(e: any) {
    let changes = this.paramsForm.form.value;
    this.storage.clear().subscribe(() => {
      this.notif.success('Nettoyage des paramêtres OK'); // TODO : tanslations
    });
  }
}
