// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
// import { FileItem } from 'dropzone/dist/dropzone.js';
// import Dropzone from 'dropzone'; => if realy needed, use Declare Dropzone: any.... same as for ccapture
// import moment from 'moment/src/moment';
import * as moment from 'moment';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { Timing } from '../../api/data-model/timing';

@Component({
  selector: 'moon-manager-client-files-loader',
  templateUrl: './client-files-loader.component.html',
  styleUrls: ['./client-files-loader.component.scss']
})
export class ClientFilesLoaderComponent implements OnInit {
  @Input() config?: any = {
    timingEventType: 'capture',
    timingAuthor: 'MiguelMonwoo',
    timingSegmentDelta: 0.2,
    paramTitle: 'Chargement des captures' // TODO translations
  };

  @Output() onTimingFetch: EventEmitter<Timing> = new EventEmitter<Timing>();

  @ViewChild('dropDetails') dropDetails: ElementRef<HTMLDivElement>; // TODO : fail to use for now

  index: number = 0;
  constructor(private storage: LocalStorage, private selfRef: ElementRef) {
    // TODO : below config will work only if user check components page
    // at least one... what to do if he gose on parameters and all is
    // not setup ? global default config injection at some point in the app ?
    // => need some solution letting defaut config param exists in targeted component...
    let selector = this.selfRef.nativeElement.tagName.toLowerCase();
    this.storage.getItem<any>('config', {}).subscribe(
      (globalConfig: any) => {
        // Called if data is valid or null
        console.log('Fetching config : ', globalConfig);
        if (!globalConfig) globalConfig = {};
        globalConfig[selector] = this.config;
        this.storage.setItem('config', globalConfig).subscribe(() => {});
      },
      error => {
        console.error('Fail to fetch config');
      }
    );
  }

  ngOnInit() {}

  dropzoneConfig = {
    url: '#', // Url set to avoid console Error, but will not be used in V1.0.0
    autoProcessQueue: false, // We will no upload to server, only local processings for V1.0.0
    autoQueue: false,
    addRemoveLinks: true,
    thumbnailWidth: 600,
    thumbnailHeight: 400
    // TODO : can't set a preview container this way :
    // => only available after ngAfterViewInit, not at constructor time...
    // Hacked via CSS for now....
    // previewsContainer: (<HTMLDivElement>this.dropDetails.nativeElement),

    // previewTemplate: '', // Do not show template previews, only need loaded thumbnails
    // accept: (f:FileItem, isValidTrigger:any) => {
    // accept: (f:any, isValidTrigger:any) => {
    //   // regex filter ? how to invalidate ? ok with current filtering for now
    //   // TODO : filter already imported pictures ? let user config this behavior....
    //   console.log(f.fullPath); // f.dataUrl may not be available yet
    //   isValidTrigger();
    // },
  };

  onImageThumbnail(args: any) {
    // https://www.dropzonejs.com/#dropzone-methods
    // https://github.com/zefoy/ngx-dropzone-wrapper/blob/v7.1.0/src/lib/dropzone.component.ts
    let f = args[0];
    let dataUrl = args[1];
    let config = this.config;
    console.log('MoonManager will process : ', f.fullPath);
    let t = new Timing();
    let date = moment(); // TODO : regex extract from path
    let subProject = ''; // TODO
    let objectif = ''; // TODO
    let title = f.fullPath; // TODO
    let project = ''; // TODO
    let segmentOverride = 0; // TODO
    let minDate = date.toDate(); // TODO

    t.id = ++this.index;
    // t.DateTime: Date;
    t.EventSource = config.timingEventType;
    t.ExpertiseLevel = '';
    t.Project = project;
    t.SubProject = subProject;
    t.Objectif = objectif;
    t.Title = title;
    t.MediaUrl = dataUrl;
    t.Author = config.timingAuthor;
    t.Comment = '';
    t.ReviewedComment = '';
    t.OverrideSequence = '';
    t.OverrideReduction = '';
    t.SegmentOverride = segmentOverride;
    t.SegmentMin = minDate;
    t.SegmentDeltaHr = config.timingSegmentDelta;
    t.SegmentMax = date.toDate();
    t.Date = new Date(date.format('YYYY/MM/DD'));
    t.Time = new Date(date.format('HH:mm:ss'));
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
  }

  onImageUploadError(e: any) {
    console.log(e);
  }
  onImageUploadSuccess(e: any) {
    console.log(e);
  }
}
