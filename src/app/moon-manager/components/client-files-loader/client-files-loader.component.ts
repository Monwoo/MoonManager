// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
// import { FileItem } from 'dropzone/dist/dropzone.js';
// import Dropzone from 'dropzone'; => if realy needed, use Declare Dropzone: any.... same as for ccapture
// import moment from 'moment/src/moment';
import * as moment from 'moment';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { Timing } from '../../api/data-model/timing';
import { MediasBufferService } from '../../services/medias-buffer.service';

@Component({
  selector: 'moon-manager-client-files-loader',
  templateUrl: './client-files-loader.component.html',
  styleUrls: ['./client-files-loader.component.scss']
})
export class ClientFilesLoaderComponent implements OnInit {
  @Input() config?: any = {
    paramTitle: 'Chargement des captures', // TODO translations
    timingEventType: 'capture',
    timingAuthor: 'John Doe',
    timingSegmentDelta: 0.2,
    // TODO : improve Parameters up to deep properties lookup with auto-gen forms for edit
    // then transform below captureRegex to flexible array....
    captureRegex_0: '.*Capture d’écran ([0-9]{4})-([0-9]{2})-([0-9]{2}) ' + 'à ([0-9]{2}).([0-9]{2}).([0-9]{2}).*.png',
    captureRegex_1: '.*Screenshot ([0-9]{4})-([0-9]{2})-([0-9]{2}) ' + 'at ([0-9]{2}).([0-9]{2}).([0-9]{2}).*.png',
    captureRegex_2: null,
    thumbW: 700,
    thumbH: 400,
    regExGitLogFile: '.*.csv',
    regExAuthor: '^[^/]+/([^/]+)/',
    regExProject: '^[^/]+/[^/]+/([^/]+)/',
    regExSubProject: '^[^/]+/[^/]+/[^/]+/([^/]+)/',
    regExObjectif: '^[^/]+/[^/]+/[^/]+/[^/]+/([^/]+)/'
  };

  @Output() onTimingFetch: EventEmitter<Timing> = new EventEmitter<Timing>();

  @ViewChild('dropDetails') dropDetails: ElementRef<HTMLDivElement>; // TODO : fail to use for now

  public filesLoadPercent: number = 0;
  public processingCount: number = 0;
  public processLength: number = 0;

  // Incrementing process number
  processInc(fname: string) {
    // console.log('Will load : ', fname);
    ++this.processLength;
    this.filesLoadPercent = (100 * this.processingCount) / this.processLength;
  }
  // Decrementing process number
  processDec(fname: string) {
    // console.log('Did load : ', fname);
    ++this.processingCount;
    this.filesLoadPercent = (100 * this.processingCount) / this.processLength;
  }

  index: number = 0;
  constructor(private storage: LocalStorage, private selfRef: ElementRef, private medias: MediasBufferService) {
    // Parameters may change from other views, will need to reload on each on show to keep config ok

    // TODO : below config will work only if user check components page
    // at least one... what to do if he gose on parameters and all is
    // not setup ? global default config injection at some point in the app ?
    // => need some solution letting defaut config param exists in targeted component...
    let selector = this.selfRef.nativeElement.tagName.toLowerCase();
    this.storage.getItem<any>('config', {}).subscribe(
      (globalConfig: any) => {
        // Called if data is valid or null
        if (!globalConfig) globalConfig = {};
        if (typeof globalConfig[selector] === 'undefined') {
          globalConfig[selector] = this.config;
        } else {
          globalConfig[selector] = { ...this.config, ...globalConfig[selector] };
          this.config = globalConfig[selector];
        }
        console.log('Fetching config : ', this.config);
        this.storage.setItem('config', globalConfig).subscribe(() => {});
      },
      error => {
        console.error('Fail to fetch config');
      }
    );
  }

  ngOnInit() {}

  ngAfterViewChecked() {}
  dropzoneConfig = {
    url: '#', // Url set to avoid console Error, but will not be used in V1.0.0
    autoProcessQueue: false, // We will no upload to server, only local processings for V1.0.0
    autoQueue: false,
    addRemoveLinks: true,
    thumbnailWidth: this.config.thumbW,
    thumbnailHeight: this.config.thumbH,
    clickable: false,
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
      this.processInc(this.getFilePath(f));
      if (new RegExp(this.config.regExGitLogFile, 'i').exec(this.getFilePath(f))) {
        this.processGitLogFile(f);
      } else if (f.type.match(/image\/.*/i)) {
        // Pictures file pre-processing before thumbnail loading...
      } else {
        // console.log("Ignoring file : ", this.getFilePath(f));
        this.processDec(this.getFilePath(f));
        return;
      }
      isValidTrigger();
    }
  };

  getFilePath(f: any) {
    return f.fullPath ? f.fullPath : f.name;
  }

  processGitLogFile(f: any) {
    // console.log('TODO : process git log file : ', f);
    this.processDec(this.getFilePath(f));
  }

  onImageThumbnail(args: any) {
    // https://www.dropzonejs.com/#dropzone-methods
    // https://github.com/zefoy/ngx-dropzone-wrapper/blob/v7.1.0/src/lib/dropzone.component.ts
    let f = args[0];
    let dataUrl = args[1];
    let config = this.config;
    // console.log('On thumbnail', this.getFilePath(f));
    // console.log('MoonManager will process : ', this.getFilePath(f));
    let t = new Timing();

    let dateStr: string = null;

    [this.config.captureRegex_0, this.config.captureRegex_1, this.config.captureRegex_2].some(
      (pattern: any, idx: number, arr: any[]) => {
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
      }
    );
    let date = dateStr ? moment(dateStr, '') : moment(); // TODO : regex extract from path
    let title = this.getFilePath(f);
    let segmentDelta = this.config.timingSegmentDelta;
    let segmentOverride = Math.floor((date.hour() + date.minute() / 60) / segmentDelta);
    let minDate = date.toDate();
    let author = new RegExp(this.config.regExAuthor, 'i').exec(this.getFilePath(f));
    let project = new RegExp(this.config.regExProject, 'i').exec(this.getFilePath(f));
    let subProject = new RegExp(this.config.regExSubProject, 'i').exec(this.getFilePath(f));
    let objectif = new RegExp(this.config.regExObjectif, 'i').exec(this.getFilePath(f));

    t.id = ++this.index;
    t.DateTime = date.toDate();
    t.EventSource = config.timingEventType;
    t.ExpertiseLevel = '';
    t.Project = project ? project[1] : '';
    t.SubProject = subProject ? subProject[1] : '';
    t.Objectif = objectif ? objectif[1] : '';
    t.Title = title;
    t.MediaUrl = this.medias.pushDataUrlMedia(dataUrl);
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
    t.SkillsId = '';
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
