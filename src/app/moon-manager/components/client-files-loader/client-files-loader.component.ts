// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit } from '@angular/core';
// import { FileItem } from 'dropzone/dist/dropzone.js';
// import Dropzone from 'dropzone'; => if realy needed, use Declare Dropzone: any.... same as for ccapture

@Component({
  selector: 'moon-manager-client-files-loader',
  templateUrl: './client-files-loader.component.html',
  styleUrls: ['./client-files-loader.component.scss']
})
export class ClientFilesLoaderComponent implements OnInit {
  constructor() {}

  dropzoneConfig = {
    url: '#', // Url set to avoid console Error, but will not be used in V1.0.0
    autoProcessQueue: false, // We will no upload to server, only local processings for V1.0.0
    autoQueue: false,
    addRemoveLinks: true,
    thumbnailWidth: 600,
    thumbnailHeight: 400
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
    console.log('MoonManager will process : ', f.fullPath);
  }

  onImageUploadError(e: any) {
    console.log(e);
  }
  onImageUploadSuccess(e: any) {
    console.log(e);
  }

  ngOnInit() {}
}
