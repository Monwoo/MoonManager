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
import {
  DynamicFormModel,
  DynamicFormLayout,
  DynamicFormService,
  DynamicFormControlModel,
  DynamicInputModel,
  DynamicFormGroupModel
} from '@ng-dynamic-forms/core';
import { I18nService } from '@app/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { BehaviorSubject } from 'rxjs';
import { LangChangeEvent } from '@ngx-translate/core';
import * as moment from 'moment';
import { Papa } from 'ngx-papaparse';
import { shallowMerge } from '../../tools';
import { Logger } from '@app/core/logger.service';
const MonwooReview = new Logger('MonwooReview');

import { CONFIG_FORM_LAYOUT, configFormModel, getFreshConf } from './config-form.model';

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

  exportFmt: string = 'csv';
  exportFmts: string[] = ['csv', 'json', 'yaml'];
  exportTitles = {
    csv: extract('mm.param.export.fmt.csv'),
    json: extract('mm.param.export.fmt.json'),
    yaml: extract('mm.param.export.fmt.yaml')
  };

  dropzoneMediasConfig = {
    url: '#', // Url set to avoid console Error, but will not be used in V1.0.0
    autoProcessQueue: false, // We will no upload to server, only local processings for V1.0.0
    autoQueue: false,
    clickable: true,
    acceptedFiles: '.json,.yaml,.csv',
    accept: (f: any, isValidTrigger: any) => {
      this.processingImport(f, 'medias');
    }
  };

  dropzoneTimingsConfig = {
    url: '#', // Url set to avoid console Error, but will not be used in V1.0.0
    autoProcessQueue: false, // We will no upload to server, only local processings for V1.0.0
    autoQueue: false,
    clickable: true,
    acceptedFiles: '.json,.yaml,.csv',
    accept: (f: any, isValidTrigger: any) => {
      this.processingImport(f, 'timings');
    }
  };

  public config: any = null;

  constructor(
    private ngZone: NgZone,
    private storage: LocalStorage,
    private i18nService: I18nService,
    private notif: NotificationsService,
    private formService: DynamicFormService,
    private papaParse: Papa,
    public i18n: I18n
  ) {}

  setExportFmt(fmt: string) {
    this.exportFmt = fmt;
  }

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
            let freshConf = await getFreshConf(this);
            this.config = shallowMerge(1, freshConf, config);
            this.ngZone.run(() => {
              // TODO : solve error :
              // ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'null:
              // Non bloquant : ca fonctionne qd meme....
              // this.formGroup.setValue(this.config);

              // TODO : better data transformer design associated to Forms Models...
              let transforms: any = {};
              try {
                const authRef = Object.keys(this.config['moon-manager-timing-pivot'].authorReferencial).map(k => {
                  const v = this.config['moon-manager-timing-pivot'].authorReferencial[k];
                  return `${k}===${v}`;
                });
                transforms['moon-manager-timing-pivot'] = {
                  authorReferencial: authRef
                };
                // TODO : input multiple do not seem to reflect Name => case Issue or something buggy ?
                // + below is more like a hack since array value is ignored from PATCH. TODO : debug or patch lib ?
                const pivotFm = <DynamicFormGroupModel>fm.find(
                  (childFm: DynamicFormControlModel, index: number, src: DynamicFormControlModel[]) => {
                    return 'moon-manager-timing-pivot' === childFm.id;
                  }
                );
                const authRefFm = <DynamicInputModel>pivotFm.group.find(
                  (childFm: DynamicFormControlModel, index: number, src: DynamicFormControlModel[]) => {
                    return 'authorReferencial' === childFm.id;
                  }
                );
                authRefFm.value = authRef;
              } catch (e) {
                MonwooReview.debug(e);
              }
              try {
                const regexsRef = this.config['moon-manager-client-files-loader'].captureRegex;
                transforms['moon-manager-client-files-loader'] = {
                  authorReferencial: regexsRef
                };
                // TODO : input multiple do not seem to reflect Name => case Issue or something buggy ?
                // + below is more like a hack since array value is ignored from PATCH. TODO : debug or patch lib ?
                const cflFm = <DynamicFormGroupModel>fm.find(
                  (childFm: DynamicFormControlModel, index: number, src: DynamicFormControlModel[]) => {
                    return 'moon-manager-client-files-loader' === childFm.id;
                  }
                );
                const captureRegex = <DynamicInputModel>cflFm.group.find(
                  (childFm: DynamicFormControlModel, index: number, src: DynamicFormControlModel[]) => {
                    return 'captureRegex' === childFm.id;
                  }
                );
                captureRegex.value = regexsRef;
              } catch (e) {
                MonwooReview.debug(e);
              }

              const patch = shallowMerge(1, this.config, transforms);
              console.log('Patching form : ', patch);
              this.formGroup.patchValue(patch);
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

    // TODO : better deep objects mappings : reactive forms ?
    // Quick hack for V1 pré-prod below :
    // let agFields = changes['moon-manager-timing-pivot'].agregationsFields;
    // agFields = typeof agFields === 'string' ? agFields.split(',') : agFields;
    // changes['moon-manager-timing-pivot'].agregationsFields = agFields;
    const authorArr = changes['moon-manager-timing-pivot'].authorReferencial;
    let authorAssoc = {};
    if (authorArr) {
      authorArr.forEach((aToA: string) => {
        const [from, to] = aToA.split('===');
        authorAssoc[from] = to;
      });
    }

    this.storage.getItem<any>('config', {}).subscribe((globalConfig: any) => {
      // Avoid to change changes, may change inside form values to...
      // changes['moon-manager-timing-pivot'].authorReferencial = authorAssoc;
      const transformed = shallowMerge(1, globalConfig, changes, {
        'moon-manager-timing-pivot': { authorReferencial: authorAssoc }
      });
      console.log('Saving changes : ', transformed);

      if (!globalConfig) globalConfig = {};
      // avoid deep merging restoring def config, or keep empty val in config ? or default only if null ?
      this.storage.setItem('config', transformed).subscribe(() => {
        this.notif.success(extract('Changements enregistré')); // TODO : tanslations
      }, this.errorHandler);
    }, this.errorHandler);
  }

  resetConfigAction(e: any) {
    // let changes = this.paramsForm.form.value;
    (async () => {
      let freshConf = await getFreshConf(this);
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

  processingExport(e: any, dest: string) {
    // TODO : auto download right format
    const exportData = (data: any) => {
      if ('csv' === this.exportFmt) {
        // https://www.papaparse.com/docs
        var csvData = data
          ? this.papaParse.unparse(data, {
              quotes: true,
              // quoteChar: '"',
              // escapeChar: '"',
              delimiter: ',',
              header: false,
              newline: '\r\n'
            })
          : '';
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
      } else {
        this.i18nService
          .get(extract('mm.param.notif.exportFail'), {
            dest: dest,
            exportFmt: this.exportFmt
          })
          .subscribe(t => {
            this.notif.error(t);
          });
        return;
      }

      // window.open(url);
      const element = document.createElement('a');
      element.href = url;
      element.download = dest + moment().format('-YYYYMMDDHHmmss.') + this.exportFmt;
      document.body.appendChild(element);
      element.click();
      this.i18nService
        .get(extract('mm.param.notif.exportSucced'), {
          dest: dest,
          exportFmt: this.exportFmt
        })
        .subscribe(t => {
          this.notif.success(t);
        });
    };
    const data: any = null;
    if (dest === 'medias') {
      this.storage.getItem<any>('medias-buffer', {}).subscribe((msArr: any) => {
        exportData(msArr);
      });
    } else if ((dest = 'timings')) {
      this.storage.getItem<any>('timings', {}).subscribe((msArr: any) => {
        exportData(msArr);
      });
    } else {
      this.i18nService
        .get(extract('mm.param.notif.destUnavailable'), {
          dest: dest,
          exportFmt: this.exportFmt
        })
        .subscribe(t => {
          this.notif.error(t);
        });
    }
  }

  processingImport(f: File, dest: string) {
    const fileName = f.name;
    const reader: FileReader = new FileReader();
    reader.onload = e => {
      if (dest === 'medias') {
      } else if (dest === 'timings' && fileName.match(/.*\.csv$/i)) {
        const csv: string = <string>reader.result;
        const parsed = this.papaParse.parse(csv, { header: false });
        console.log('TODO : process git log datas : ', parsed);
        // TODO : scheme checking ? what if bad format ?
        // this.processInc(null, parsed.data.length);
        parsed.data.forEach((row: string[]) => {
          // let t = new Timing();
          // let date = moment(row[2], ''); // TODO : regex extract from path
          // let segmentDelta = 1; // TODO : curently hard coded, need to be loaded with eventSource
          // let segmentOverride = Math.floor((date.hour() + date.minute() / 60) / segmentDelta);
          // t.id = ++this.index;
          // t.DateTime = date.toDate();
          // t.EventSource = 'git-log'; // TODO : configurable from parameters ?
          // t.ExpertiseLevel = row.length > 8 ? row[8] : '';
          // t.Project = row.length > 5 ? row[5] : '';
          // t.SubProject = row.length > 6 ? row[6] : '';
          // t.Objectif = row.length > 7 ? row[7] : '';
          // t.Comment = row[3];
          // t.Title = t.Comment.substring(0, 100);
          // t.MediaUrl = row[0];
          // t.Author = row.length > 4 ? row[4] : this.config.timingAuthor;
          // t.ReviewedComment = '';
          // t.OverrideSequence = '';
          // t.OverrideReduction = '';
          // t.SegmentOverride = segmentOverride;
          // // t.SegmentMin = minDate; TODO : refactor, not really used
          // t.SegmentDeltaHr = segmentDelta;
          // t.SegmentMax = date.toDate();
          // t.Date = date.format('YYYY/MM/DD');
          // t.Time = date.format('HH:mm:ss');
          // t.Month = '';
          // t.Year = '';
          // // Client side computed fields :
          // t.LinearWorkloadAmount = 0;
          // t.WorkloadAmount = 0;
          // t.TJM = 0;
          // t.TJMWorkloadByDay = 0;
          // t.Price = 0;
          // t.isHidden = false;
          // this.onTimingFetch.emit(t);
          // this.processDec(this.getFilePath(f));
        });
      } else {
        console.log('Unknow import dest : ', dest);
        return;
      }
      // this.processDec(this.getFilePath(f));
    };
    reader.onabort = (ev: ProgressEvent) => {
      console.log('Aborting : ', f);
      // this.processDec(this.getFilePath(f));
    };
    reader.onerror = (ev: ProgressEvent) => {
      console.error('Error for : ', f);
      // this.processDec(this.getFilePath(f));
    };
    reader.readAsText(f);
  }

  onUploadError(e: any, dst: string) {
    console.log('Upload error', e);
  }
}
