// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'moon-manager-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('paramsForm') paramsForm: NgForm; // TODO : fail to use for now

  constructor(private storage: LocalStorage, private notif: NotificationsService) {}

  public config: any;

  ngOnInit() {
    // Load from params from local storage :
    this.storage.getItem<any>('config', {}).subscribe(
      config => {
        // Called if data is valid or null
        console.log('Fetching config : ', config);
        this.config = config;
      },
      error => {
        console.error('Fail to fetch config');
      }
    );
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

  saveAction(e: any) {
    let changes = this.paramsForm.form.value;
    console.log('Saving changes : ', changes);

    // TODO : better deep objects mappings : reactive forms ?
    // Quick hack for V1 pré-prod below :
    let agFields = changes['moon-manager-timing-pivot'].agregationsFields;
    agFields = typeof agFields === 'string' ? agFields.split(',') : agFields;
    changes['moon-manager-timing-pivot'].agregationsFields = agFields;

    this.storage.setItem('config', changes).subscribe(() => {
      this.notif.success('Changements enregistré'); // TODO : tanslations
    });
  }

  resetConfigAction(e: any) {
    let changes = this.paramsForm.form.value;
    this.storage.clear().subscribe(() => {
      this.notif.success('Nettoyage des paramêtres OK'); // TODO : tanslations
    });
  }
}
