// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, NgZone, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
// import { FileItem } from 'dropzone/dist/dropzone.js';
// import Dropzone from 'dropzone'; => if realy needed, use Declare Dropzone: any.... same as for ccapture
// import moment from 'moment/src/moment';
import * as moment from 'moment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Papa } from 'ngx-papaparse';
import { extract } from '@app/core';

import { Timing } from '../../api/data-model/timing';
import { MediasBufferService } from '../../services/medias-buffer.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { configDefaults } from './config-form.model';
import { I18nService } from '@app/core';
import { LoadingLoaderService } from '../../services/loading-loader.service';

@Component({
  selector: 'moon-manager-client-files-loader',
  templateUrl: './client-files-loader.component.html',
  styleUrls: ['./client-files-loader.component.scss']
})
export class ClientFilesLoaderComponent implements OnInit {
  trans = {
    dropZonePlaceholder: extract(
      'Drag structured folder of your captures (and|or) git_logs.csv over here to load them in MoonManager'
    )
  };

  @Input() config?: any = null;

  @Output() onTimingFetch: EventEmitter<Timing> = new EventEmitter<Timing>();

  @ViewChild('dropDetails') dropDetails: ElementRef<HTMLDivElement>; // TODO : fail to use for now

  public filesLoadPercent: number = 0;
  public processingCount: number = 0;
  public processLength: number = 0;

  // Incrementing process number
  processInc(fname: string, step = 1) {
    // console.log('Will load : ', fname);
    this.ngZone.run(() => {
      this.processLength += step;
      this.filesLoadPercent = (100 * this.processingCount) / this.processLength;
      if (this.processingCount !== this.processLength) {
        this.ll.showLoader();
      }
    });
  }
  // Decrementing process number
  processDec(fname: string, step = 1) {
    // console.log('Did load : ', fname);
    this.ngZone.run(() => {
      this.processingCount += step;
      this.filesLoadPercent = (100 * this.processingCount) / this.processLength;
      if (this.processingCount === this.processLength) {
        this.ll.hideLoader();
      }
    });
  }

  index: number = 0;
  constructor(
    private ll: LoadingLoaderService,
    private ngZone: NgZone,
    private storage: LocalStorage,
    private selfRef: ElementRef,
    private medias: MediasBufferService,
    private papaParse: Papa,
    public i18nService: I18nService,
    public i18n: I18n // TODO : singleton or other default injection ? hard to put it in every components...
  ) {
    // Parameters may change from other views, will need to reload on each on show to keep config ok

    // TODO : below config will work only if user check components page
    // at least one... what to do if he gose on parameters and all is
    // not setup ? global default config injection at some point in the app ?
    // => need some solution letting defaut config param exists in targeted component...
    let selector = 'moon-manager-client-files-loader'; //this.selfRef.nativeElement.tagName.toLowerCase();

    configDefaults(this).then(cDef => {
      this.config = cDef;
      this.storage.getItem<any>('config', {}).subscribe(
        (globalConfig: any) => {
          // Called if data is valid or null
          if (!globalConfig) globalConfig = {};
          if (typeof globalConfig[selector] === 'undefined') {
            // globalConfig[selector] = this.config;
          } else {
            // globalConfig[selector] = { ...this.config, ...globalConfig[selector] };
            this.config = { ...this.config, ...globalConfig[selector] };
          }
          console.log(selector + ' Fetching config : ', this.config);
          // this.storage.setItem('config', globalConfig).subscribe(() => {});

          this.dropzoneConfig = {
            url: '#', // Url set to avoid console Error, but will not be used in V1.0.0
            autoProcessQueue: false, // We will no upload to server, only local processings for V1.0.0
            autoQueue: false,
            addRemoveLinks: true,
            thumbnailWidth: this.config.thumbW,
            thumbnailHeight: this.config.thumbH,
            clickable: true,
            thumbnailMethod: 'contain',
            acceptedFiles: 'image/*,.csv',
            // transformFile: (f:any, done:any) => {
            //   console.log("On transform", this.getFilePath(f));
            //   done(f); // https://www.dropzonejs.com/#config-transformFile
            // },
            // TODO : can't set a preview container this way :
            // => only available after ngAfterViewInit, not at constructor time...
            // Hacked via CSS for now....
            // previewsContainer: (<HTMLDivElement>this.dropDetails.nativeElement),

            // previewTemplate: '', // Do not show template previews, only need loaded thumbnails
            // accept: (f:FileItem, isValidTrigger:any) => {
            // accept: (f:any, isValidTrigger:any) => {
            //   // regex filter ? how to invalidate ? ok with current filtering for now
            //   // TODO : filter already imported pictures ? let user config this behavior....
            //   console.log(this.getFilePath(f)); // f.dataUrl may not be available yet
            //   isValidTrigger();
            // },

            accept: (f: any, isValidTrigger: any) => {
              // console.log("On accept", f);
              // => show loader on drop, may take time to load...
              this.processInc(this.getFilePath(f));
              if (new RegExp(this.config.regExGitLogFile, 'i').exec(this.getFilePath(f))) {
                this.processGitLogFile(f);
              } else if (f.type.match(/image\/.*/i)) {
                // Pictures file pre-processing before thumbnail loading...
              } else {
                console.log('Ignoring file : ', this.getFilePath(f));
                this.processDec(this.getFilePath(f));
                return;
              }
              isValidTrigger();
            }
          };
        },
        error => {
          console.error('Fail to fetch config');
        }
      );
    });
  }

  onFileDrop(e: any) {
    // TODO : do not seem to be called
    console.log('File droped : ', e);
    // this.processInc('startPoint');//this.getFilePath(f));
  }
  ngOnInit() {}

  ngAfterViewChecked() {}
  dropzoneConfig: any = null;

  getFilePath(f: any) {
    return f.fullPath ? f.fullPath : f.name;
  }

  async processGitLogFile(f: any) {
    const file: File = f;
    const reader: FileReader = new FileReader();
    reader.onload = e => {
      const csv: string = <string>reader.result;
      const parsed = this.papaParse.parse(csv, { header: false });
      console.log('TODO : process git log datas : ', parsed);
      // TODO : scheme checking ? what if bad format ?
      // this.processInc(null, parsed.data.length);
      parsed.data.forEach((row: string[]) => {
        this.processInc(null);
        let t = new Timing();
        let date = moment(row[2], ''); // TODO : regex extract from path
        let segmentDelta = 1; // TODO : curently hard coded, need to be loaded with eventSource
        let segmentOverride = Math.floor((date.hour() + date.minute() / 60) / segmentDelta);

        t.id = ++this.index;
        t.DateTime = date.toDate();
        t.EventSource = 'git-log'; // TODO : configurable from parameters ?
        t.ExpertiseLevel = row.length > 8 ? row[8] : this.config.timingSkills;
        t.Project = row.length > 5 ? row[5] : this.config.timingProject;
        t.SubProject = row.length > 6 ? row[6] : this.config.timingSubProject;
        t.Objectif = row.length > 7 ? row[7] : this.config.Objectif;
        t.Comment = row[3];
        t.Title = t.Comment.substring(0, 100);
        t.MediaUrl = row[0];
        t.Author = row.length > 4 ? row[4] : this.config.timingAuthor;
        t.ReviewedComment = '';
        t.OverrideSequence = '';
        t.OverrideReduction = '';
        t.SegmentOverride = segmentOverride;
        // t.SegmentMin = minDate; TODO : refactor, not really used
        t.SegmentDeltaHr = segmentDelta;
        t.SegmentMax = date.toDate();
        t.Date = date.format('YYYY/MM/DD');
        t.Time = date.format('HH:mm:ss');
        t.Month = '';
        t.Year = '';
        // Client side computed fields :
        t.LinearWorkloadAmount = 0;
        t.WorkloadAmount = 0;
        t.TJM = 0;
        t.TJMWorkloadByDay = 0;
        t.Price = 0;
        t.isHidden = false;

        this.onTimingFetch.emit(t);
        this.processDec(this.getFilePath(f));
      });
      this.processDec(this.getFilePath(f));
    };
    reader.onabort = (ev: ProgressEvent) => {
      console.log('Aborting : ', f);
      this.processDec(this.getFilePath(f));
    };
    reader.onerror = (ev: ProgressEvent) => {
      console.error('Error for : ', f);
      this.processDec(this.getFilePath(f));
    };
    reader.readAsText(file);
  }

  async onImageThumbnail(args: any) {
    // https://www.dropzonejs.com/#dropzone-methods
    // https://github.com/zefoy/ngx-dropzone-wrapper/blob/v7.1.0/src/lib/dropzone.component.ts
    let f = args[0];
    let dataUrl = args[1];
    let config = this.config;
    // console.log('On thumbnail', this.getFilePath(f));
    // console.log('MoonManager will process : ', this.getFilePath(f));
    let t = new Timing();

    let dateStr: string = null;

    this.config.captureRegex.some((pattern: any, idx: number, arr: any[]) => {
      // let matches = this.getFilePath(f).match(pattern);
      let rgEx = new RegExp(pattern, 'i');
      let m = rgEx.exec(this.getFilePath(f));
      // console.log('Matches : ', m);
      if (m) {
        // TODO : extract should be by regex, lucky for now, having same pattern...
        // "$1/$2/$3 $4:$5:$6"
        dateStr = `${m[1]}/${m[2]}/${m[3]} ${m[4]}:${m[5]}:${m[6]}`;
      }
      return dateStr ? true : false;
    });
    let date = dateStr ? moment(dateStr, '') : moment(); // TODO : regex extract from path
    let title = this.getFilePath(f);
    let segmentDelta = this.config.timingSegmentDelta;
    let segmentOverride = Math.floor((date.hour() + date.minute() / 60) / segmentDelta);
    let minDate = date.toDate(); // TODO : refactor : minDate not realy used...
    let author = new RegExp(this.config.regExAuthor, 'i').exec(this.getFilePath(f));
    let project = new RegExp(this.config.regExProject, 'i').exec(this.getFilePath(f));
    let subProject = new RegExp(this.config.regExSubProject, 'i').exec(this.getFilePath(f));
    let objectif = new RegExp(this.config.regExObjectif, 'i').exec(this.getFilePath(f));
    let skillsId = new RegExp(this.config.regExSkillsId, 'i').exec(this.getFilePath(f));

    t.id = ++this.index;
    t.DateTime = date.toDate();
    t.EventSource = config.timingEventType;
    t.Project = project ? project[1] : config.timingProject;
    t.SubProject = subProject ? subProject[1] : config.timingSubProject;
    t.Objectif = objectif ? objectif[1] : config.timingObjectif;
    t.Title = title;
    t.MediaUrl = await this.medias.pushDataUrlMedia(dataUrl);
    t.Author = author ? author[1] : config.timingAuthor;
    t.Comment = '';
    t.ReviewedComment = '';
    t.OverrideSequence = '';
    t.OverrideReduction = '';
    t.SegmentOverride = segmentOverride;
    t.SegmentMin = minDate;
    t.SegmentDeltaHr = segmentDelta;
    t.SegmentMax = date.toDate();
    t.Date = date.format('YYYY/MM/DD');
    t.Time = date.format('HH:mm:ss');
    t.Month = '';
    t.Year = '';
    // t.SkillsId = // TODO : refactor model to Skills
    t.ExpertiseLevel = skillsId ? skillsId[1] : config.timingSkills;
    // Client side computed fields :
    t.LinearWorkloadAmount = 0;
    t.WorkloadAmount = 0;
    t.TJM = 0;
    t.TJMWorkloadByDay = 0;
    t.Price = 0;
    t.isHidden = false;

    this.onTimingFetch.emit(t);
    this.processDec(this.getFilePath(f));
  }

  onImageUploadError(e: any) {
    console.log('Upload error', e);
  }
  onImageUploadSuccess(e: any) {
    console.log('Upload success : ', e);
  }

  onAddedFile(e: any) {
    console.log('Added sucess : ', e);
  }

  onProcessingFile(e: any) {
    console.log('Processing success : ', e);
  }
}
