// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { BehaviorSubject } from 'rxjs';
import { TreeNode } from 'primeng/primeng';
import * as moment from 'moment';
import { set as setProperty } from 'lodash-es';
import { get as getProperty } from 'lodash-es';
import { has as hasProperty } from 'lodash-es';

import { Timing } from '../../api/data-model/timing';
import { MediasBufferService } from '../../services/medias-buffer.service';

declare var CCapture: any;

@Component({
  selector: 'moon-manager-timing-pivot',
  templateUrl: './timing-pivot.component.html',
  styleUrls: ['./timing-pivot.component.scss']
})
export class TimingPivotComponent implements OnInit {
  @Input() dataSrc: BehaviorSubject<Timing[]>;

  @Output() isFocused: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('videoCanvas') videoCanvas: ElementRef<HTMLCanvasElement>;
  public videoCtx: CanvasRenderingContext2D = null;
  public videoLoadPercent: number = 0;

  public filteredDatas: Timing[] = [];
  public filteredDatasAsync: BehaviorSubject<Timing[]> = new BehaviorSubject<Timing[]>([]);
  public timingsTrees: TreeNode[] = [];

  public agregationsFields = ['Author', 'Project', 'SubProject', 'Objectif', 'Date', 'Time'];
  public allObjectifs: Set<string> = new Set();

  // TODO : improve by using array of all selected column and re-order all below
  // ? or maybe enough to simply reorder agregationsFields ?
  public selectedAgregation = 'Author';

  public billedDays = 8; // TODO : from params or config & editable user form
  public paidDays = 8;
  public compensatedDays = 2.25;
  public receivedDays = 2.25;
  public summaryTitle = "Compte rendu d'activité de M. Miguel Monwoo A.K.A. Mickaël Moreau pour VivaO via C. Mollet";
  public printableDetails = false;

  // TODO: normalizedUsedSegmentsMaxTjm => do not avoid change of TJM if more
  // valuable TJM is reached on same segment already used...
  public normalizedUsedSegments = {};
  public linearUsedSegments = {};
  // Minimum diviseur commun de tous les SegmentsDeltas ?
  // TODO : should be computed from dataset (Min diviseur commun), and configurable by end user form... :
  // Our dataset only handle 1hr for git log and 0.2hr for capture. 0.2 divid all of those => ok for now...
  public normalizedSegmentFactor = 0.2;
  public timingsByDay = {};
  public timingsByDayAsync: BehaviorSubject<{}> = new BehaviorSubject<{}>({});
  public workloadTotal = 0;
  public workloadByBillableDayTotal = 0;
  public billingTotal = 0;
  public daysMargin = 0;
  public daysForseen = 0;

  //  setTimeout is overwritten by
  // https://github.com/spite/ccapture.js/blob/master/src/CCapture.js
  // so need to keep original version for our custom delays, or use IMPORT from ??
  private _originalTimeout: any = null;

  public skillsRef = {
    RemoteEasyDev: {
      title: 'Remote easy dev', // TODO : translation
      idx: 'RED',
      description: `Service de développement sur demande pour des objectifs
      simples executable en 1 journée au maximum
      sans nécessité de suivi ni gestion de projet.`, // TODO : translation
      maxBusyHrByDay: 5,
      justificatifs: `5hr max via capture d'écran valant ${0.2}hr et
      git log valant ${1}hr` // TODO : times from form fields
    },
    RemoteProjectManagement: {
      title: 'Remote project management', // TODO : translation
      idx: 'RPM',
      description: 'Service de gestion de projet', // TODO : translation
      maxBusyHrByDay: 5,
      justificatifs: `5hr max via capture d'écran valant ${0.2}hr et
      git log valant ${1}hr` // TODO : times from form fields
    },
    RemoteReverseEngineering: {
      title: 'Remote reverse engineering', // TODO : translation
      idx: 'RRE',
      description: `Service d'analyse logiciel`, // TODO : translation
      maxBusyHrByDay: 5,
      justificatifs: `5hr max via capture d'écran valant ${0.2}hr et
      git log valant ${1}hr` // TODO : times from form fields
    },
    RemoteFeaturesForcast: {
      title: 'Remote features forcast', // TODO : translation
      idx: 'RFF',
      description: `Service de veille technique et prévisionnelle`, // TODO : translation
      maxBusyHrByDay: 5,
      justificatifs: `5hr max via capture d'écran valant ${0.2}hr et
      git log valant ${1}hr` // TODO : times from form fields
    },
    RemoteFullTutorialAndKnowledgeTransfert: {
      title: 'Remote full tutorial and knowledge transfert', // TODO : translation
      idx: 'RFTKT',
      description: `Service de formation, de transfert
      et d'analyse de connaissances`, // TODO : translation
      maxBusyHrByDay: 5,
      justificatifs: `5hr max via capture d'écran valant ${0.2}hr et
      git log valant ${1}hr` // TODO : times from form fields
    }
  };

  // TODO : let user change it from form field and show all refresh....
  public TJMBySkillsId = {
    RemoteEasyDev: 400,
    RemoteProjectManagement: 500,
    RemoteReverseEngineering: 600,
    RemoteFeaturesForcast: 700,
    RemoteFullTutorialAndKnowledgeTransfert: 800
  };
  // public HrSegmentBySource = {
  //   capture: 0.2,
  //   'git-log': 1
  // };
  public authorReferencial = {
    MiguelMonwoo: 'Miguel Monwoo',
    'Mickael Moreau': 'Miguel Monwoo',
    'mickael moreau': 'Miguel Monwoo',
    'Elmis David Hernandez': 'Elmis Hernandez',
    'elmis-hernandez': 'Elmis Hernandez',
    'Erwan Le Breton': 'Erwan Le Breton'
  };
  public authorFilterList = ['Miguel Monwoo'];

  public classByMonth = {
    '01': 'mat-gray-400',
    '02': 'mat-gray-500',
    '03': 'mat-gray-600',
    '04': 'mat-gray-700',
    '05': 'mat-gray-800',
    '06': 'mat-gray-900',
    '07': 'mat-gray-400',
    '08': 'mat-gray-500',
    '09': 'mat-gray-600',
    '10': 'mat-gray-700',
    '11': 'mat-gray-800',
    '12': 'mat-gray-900'
  };

  // TODO : find fully integrated with Max common tools language system
  // Quick hack for now :
  public trans = {
    toggleDataLoadBtn: 'Arrêter le chargement'
  };

  @ViewChild('pivot_grid') pivot: ElementRef;
  // TODO : Quick version, doing computation based on spreadsheet Timing Extractor
  // to get useful Workload informations
  rowGroupMetadata: any;

  constructor(private currencyPipe: CurrencyPipe, private medias: MediasBufferService) {
    this._originalTimeout = window.setTimeout;
  }
  ngOnInit() {}

  // async delay(ms: number, resultCallback) {
  //   await new Promise(resolve =>
  //     setTimeout(()=>resolve(resultCallback()), ms)
  //   ).then(()=>console.log("Delay ok"));
  // }
  async computeDelay(ms: number, resultCallback: any) {
    await new Promise(resolve =>
      // setTimeout(()=>resolve(resultCallback()), ms)
      this._originalTimeout(() => {
        resultCallback();
        resolve();
      }, ms)
    ); //.then(()=>console.log("Delay ok"));
  }

  normalizeSegment(t: Timing) {
    // TODO : need to normalize segments => reduce all segments
    // targeted by (t.Date - t.SegmentDeltaHr).
    // TODO : ensure factor is dividable as integer, chose common denominator as factor...
    let countOfSegmentsOverride = t.SegmentDeltaHr / this.normalizedSegmentFactor;
    let LinearWorkloadAmount = 0;
    let workloadAmount = 0;
    let date = moment(t.DateTime);

    for (let i = 0; i < countOfSegmentsOverride; i++) {
      let segmentIndex = Math.floor((date.hours() + date.minutes() / 60) / this.normalizedSegmentFactor) - i;
      let segmentDate = moment(date);
      if (segmentIndex < 0) {
        // TODO : more generic algo, this one will fail if segment overlap in more than one day
        // (ok for our case, max is 1hr...)
        // break; // ignore previous day workload TODO : get this time back in formula ?
        segmentDate = segmentDate.subtract(1, 'days');
        segmentIndex += 24 / this.normalizedSegmentFactor;
      }
      const formatedDate = segmentDate.format('YYYY-MM-DD');
      // t.OverrideReduction
      // TODO : more generic Algo, just call normSetterCallback from function param ?
      let segmentUsePath = [t.Author, formatedDate, segmentIndex];
      let segmentMaxTJM = getProperty(this.normalizedUsedSegments, segmentUsePath);
      if (segmentMaxTJM) {
        if (t.TJM > segmentMaxTJM) {
          // segment is already used by another lower TJM => need to balance back TJM deltas :
          workloadAmount += (((t.TJM - segmentMaxTJM) * t.TJMWorkloadByDay) / t.TJM) * this.normalizedSegmentFactor;
          segmentMaxTJM = t.TJM;
        }
      } else {
        workloadAmount += this.normalizedSegmentFactor;
        segmentMaxTJM = t.TJM;
      }
      setProperty(this.normalizedUsedSegments, segmentUsePath, segmentMaxTJM);

      let linearSegmentUsePath = this.agregationsFields
        .slice(0, -1)
        .map(f => t[f])
        .concat([formatedDate, segmentIndex]);
      let linearUsed = getProperty(this.linearUsedSegments, linearSegmentUsePath);
      if (!linearUsed) {
        LinearWorkloadAmount += this.normalizedSegmentFactor;
        linearUsed = true;
      }
      setProperty(this.linearUsedSegments, linearSegmentUsePath, linearUsed);
    }
    t.LinearWorkloadAmount = LinearWorkloadAmount;
    t.WorkloadAmount = workloadAmount;
  }

  ngAfterViewInit() {
    this.videoCtx = (<HTMLCanvasElement>this.videoCanvas.nativeElement).getContext('2d'); // TODO : BONUS add Unity to render in gameCtx => '3D'
    this.dataSrc.subscribe((timings: Timing[]) => {
      // timings.sort((t1, t2) => { // TODO : inject and sort global timings table => auto load past data when going done...
      //   return this.agregationsFields.reduce((acc, field) => {
      //     return acc || (typeof t1[field] === 'string' || t1[field] instanceof String
      //       ? t1[field].localeCompare(t2[field])
      //       : t1[field] - t2[field]
      //     );
      //   }, 0);
      // });
      // this.zone.run(() => {
      (() => {
        console.log(timings);
        this.filteredDatas = this.filteredDatas.concat(
          timings.reduce((acc, t) => {
            // TODO : DATA Transformers designs ...
            if (t.Author in this.authorReferencial) {
              t.Author = this.authorReferencial[t.Author];
            }
            if (!this.authorFilterList.includes(t.Author)) {
              return acc; // avoid filtered datas
            }

            // TODO : default init from user profile params ?
            t.isHidden = false;
            t.WorkloadAmount = 0;
            // only counts first events in import that overwrite a
            // time periode segment.
            // Could also be done by Tablor formula :
            // CountsAllUniques(AgregatedRange)
            // let skillsId = t.SkillsId in this.TJMBySkillsId ?
            //   t.SkillsId : 'RemoteEasyDev'; // TODO : default as param ?
            let skillsId = hasProperty(this.TJMBySkillsId, t.ExpertiseLevel) ? t.ExpertiseLevel : 'RemoteEasyDev';
            t.SkillsId = skillsId;
            t.TJM = this.TJMBySkillsId[skillsId];
            // Nombre d'heure travaillé Max pr 1 jours facturé
            t.TJMWorkloadByDay = this.skillsRef[skillsId].maxBusyHrByDay;
            t.LinearWorkloadAmount = t.SegmentDeltaHr;

            this.normalizeSegment(t);
            // TODO : let user input it from config form for all report ?
            // BONUS associate TJM to Author and UsedSkills keys...
            // -> for bonus : auto-gen Referentiel in Form detail (keep
            // mantatory feature of auto fix global TJM, just add detail setup
            // if user need it...)

            t.Price = (t.TJM * t.WorkloadAmount) / t.TJMWorkloadByDay;
            // let use MySQL date format :
            // https://stackoverflow.com/questions/15411833/using-moment-js-to-convert-date-to-string-mm-dd-yyyy
            let dateIdx = moment(t.Date).format('YYYY-MM-DD');
            if (!hasProperty(this.timingsByDay, dateIdx)) {
              this.timingsByDay[dateIdx] = [];
            }
            this.timingsByDay[dateIdx].push(t);
            this.workloadTotal += t.WorkloadAmount;
            this.workloadByBillableDayTotal += t.WorkloadAmount / t.TJMWorkloadByDay;
            this.billingTotal += t.Price;
            this.daysMargin = this.paidDays + this.receivedDays - this.workloadByBillableDayTotal;
            this.daysForseen = this.billedDays + this.compensatedDays;

            this.insertInTimingsTrees(t);
            this.allObjectifs.add(t.Objectif);
            acc.push(t);

            return acc;
          }, [])
        );

        this.filteredDatasAsync.next(this.filteredDatas.slice().reverse());
        console.log('Filtered data : ', this.filteredDatas);

        this.timingsByDayAsync.next(this.timingsByDay);

        // this.timingsTrees = <TreeNode[]> JSON.parse(JSON.stringify(this.timingsTrees));
        // https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json/11616993
        const cache = new Set();
        this.timingsTrees = <TreeNode[]>JSON.parse(
          JSON.stringify(this.timingsTrees, (key, value) => {
            if (typeof value === 'object' && value !== null) {
              if (cache.has(value)) {
                // Circular reference found, discard key
                return; // TODO : which field is circular ref ? strange...
              }
              // Store value in our set
              cache.add(value);
            }
            return value;
          })
        );

        // this.timingsTrees = <TreeNode[]> [
        //   {
        //     "data": {
        //       "Title": "MiguelMonwoo",
        //       "Time": "08:41:04",
        //       "SkillsId": "RemoteEasyDev",
        //       "WorkloadAmount": 0.2,
        //       "TJM": 400,
        //       "Price": 16
        //     },
        //     "children": [
        //       {
        //         "data": {
        //           "Title": "capture",
        //           "Time": "08:41:04",
        //           "SkillsId": "RemoteEasyDev",
        //           "WorkloadAmount": 0.2,
        //           "TJM": 400,
        //           "Price": 16
        //         },
        //       }
        //     ]
        //   },
        // ];

        console.log('timingsTrees', this.timingsTrees);
        console.log('AgregationsLookup', this.agregationsLookup);
      })(); // });
    });
  }

  private agregationsLookup = {};

  insertInTimingsTrees(t: Timing) {
    let agregationPath = '';
    let fieldPath = '';
    this.agregationsFields.forEach((field, idx) => {
      // TODO : let reduce = sum done via agregaor functions linked to argeged fields
      let title = t[field];
      fieldPath += `${field}<${title}>`;
      let separator = agregationPath === '' ? '' : '.';
      // let subGroupLength = getProperty(this.timingsTrees, agregationPath + separator + 'children', []).length;
      let groupPath = agregationPath.replace(/\.[0-9]+$/, '');
      let groupLength =
        groupPath === '' ? this.timingsTrees.length : getProperty(this.timingsTrees, groupPath, []).length;
      // Building rows groups metadatas :
      let lookupPath = [fieldPath];
      if (!getProperty(this.agregationsLookup, lookupPath)) {
        setProperty(this.agregationsLookup, lookupPath, {
          index: groupLength,
          computingsByField: {}
        });
      }

      let updateAgregationsFields = (agField: string, reducer: any, initialValue: any = null) => {
        // let agPath = `${lookupPath}.computingsByField.${agField}`;
        let agPath = [...lookupPath, 'computingsByField', agField];
        let lastAgregation = getProperty(this.agregationsLookup, agPath, initialValue);
        setProperty(this.agregationsLookup, agPath, reducer(lastAgregation, t));
      };

      updateAgregationsFields(
        'Time',
        (lastAgregation: any, t: Timing) => {
          // lastAgregation[moment(t.Time, "HH:mm:ss").format('HH')] = true;
          lastAgregation[t.Time.split(':')[0]] = true;
          return lastAgregation;
        },
        {}
      );

      updateAgregationsFields(
        'SkillsId',
        (lastAgregation: any, t: Timing) => {
          // lastAgregation[moment(t.Time, "HH:mm:ss").format('HH')] = true;
          lastAgregation[this.skillsRef[t.SkillsId].idx] = true;
          return lastAgregation;
        },
        {}
      );

      updateAgregationsFields(
        'LinearWorkloadAmount',
        (lastAgregation: any, t: Timing) => {
          // TODO : model to finely handle normalized Segments over agregation fields
          // instead of algo copies...
          lastAgregation.total += t.LinearWorkloadAmount;
          return lastAgregation;
        },
        {
          total: 0
          // normalizedUsedSegments:  {}, // TODO ?
        }
      );

      updateAgregationsFields(
        'WorkloadAmount',
        (lastAgregation: any, t: Timing) => {
          return lastAgregation + t.WorkloadAmount;
        },
        0
      );

      updateAgregationsFields(
        'TJM',
        (lastAgregation: any, t: Timing) => {
          lastAgregation[t.TJM] = true;
          return lastAgregation;
        },
        {}
      );

      updateAgregationsFields(
        'Price',
        (lastAgregation: any, t: Timing) => {
          return lastAgregation + t.Price;
        },
        0
      );

      updateAgregationsFields(
        'EventSource',
        (lastAgregation: any, t: Timing) => {
          // lastAgregation[moment(t.Time, "HH:mm:ss").format('HH')] = true;
          lastAgregation[t.EventSource] = true;
          return lastAgregation;
        },
        {}
      );

      // TODO : use reducer callback from config properties ?

      let lookup = getProperty(this.agregationsLookup, lookupPath);
      let groupIndex = lookup.index;
      let path = agregationPath + separator + `${groupIndex}`;

      // Building tree
      let treeData = {
        // {...defaultData, ...{
        EventSource: t.EventSource,
        Title: title,
        TreeIdx: idx,
        Time: t.Time,
        SkillsId: t.SkillsId,
        LinearWorkloadAmount: t.LinearWorkloadAmount,
        WorkloadAmount: t.WorkloadAmount,
        TJM: this.currencyPipe.transform(t.TJM, 'EUR'),
        Price: t.Price
      };
      if (idx !== this.agregationsFields.length - 1) {
        // Compute sum & agregation of sub-totals rows :
        // TODO : replace with better design patter : loop over lookup.computingsByField and
        // use same systeme as SF CVVideo patern ways as for forms keys bindings... : (OutputTransformers)
        treeData.EventSource = Object.keys(lookup.computingsByField['EventSource'])
          .sort()
          .join('<br/>');
        treeData.Time = Object.keys(lookup.computingsByField['Time'])
          .sort()
          .join(', ');
        treeData.SkillsId = Object.keys(lookup.computingsByField['SkillsId'])
          .sort()
          .join(', ');
        treeData.WorkloadAmount = lookup.computingsByField['WorkloadAmount'];
        treeData.LinearWorkloadAmount = lookup.computingsByField['LinearWorkloadAmount'].total;
        treeData.TJM = Object.keys(lookup.computingsByField['TJM'])
          .sort()
          .map(e => this.currencyPipe.transform(e, 'EUR'))
          .join(', ');
        treeData.Price = lookup.computingsByField['Price'];

        if (idx < this.agregationsFields.length - 3) {
          setProperty(this.timingsTrees, path + '.expanded', true);
        }
      } else {
        // injecting leaf datas :
        let subGroupLength = getProperty(this.timingsTrees, agregationPath, []).length;
        path = agregationPath + separator + `${subGroupLength}`;
      }

      // if (!getProperty(this.timingsTrees, path)) {
      //   // setProperty(this.agregationsLookup, [field, title], groupLength);
      //   setProperty(this.timingsTrees, path, treeData);
      // }
      setProperty(this.timingsTrees, path + '.data', treeData);
      agregationPath += separator + `${groupIndex}.children`;
    });
  }

  exportsTimingsToVideoAsWebM() {
    // CF source code of :
    // http://techslides.com/demos/image-video/create.html
    let self = this;
    let computeDelayMs = 42; // 1/24*1000 = 41.66
    // => will add 1 frame at chosen FPS speed to capture...
    let stackDelayFrame = 0; // will wait for compute : stackDelayFrame * computeDelayMs
    let bulkDownloadSize = 2500; // TODO : split video if too long ??? bulk download is halfSolution...
    let frames = this.filteredDatas // TODO : solve too much api call issue and remove slice limit
      //.filter(t=>('capture' === t.EventSource && typeof(t.MediaUrl)!=='undefined'))
      // .slice(0, 125).reverse() //.map((t:Timing) => (t.MediaUrl));
      .slice()
      .reverse(); //.map((t:Timing) => (t.MediaUrl));
    let fps = 25;
    // let video = new Whammy.Video(fps); => having issue with too fast img fetching...
    // will try other framework waitting to see if Whammy gets improved....
    var capturer = new CCapture({
      framerate: 24, // stackDelayFrame will wait 1/24 sec for vid output
      verbose: false,
      format: 'webm'
    });
    capturer.start();

    let canvas: HTMLCanvasElement = <HTMLCanvasElement>this.videoCanvas.nativeElement;
    let context: CanvasRenderingContext2D = this.videoCtx; // TODO from elts ref.

    // frames.forEach((f, idx) => {
    //   process(f, idx);
    // });
    let loopFrames = (idx: number) => {
      let f = frames[idx];
      if (stackDelayFrame > 0) {
        // TODO : rebuild with promise system : some process is Async, waiting for download
        // keep wating for the asked delayed frames
        --stackDelayFrame;
        capturer.capture(canvas);
      } else {
        // process and get to next frame
        process(f, idx);
        ++idx;
      }
      if (idx < frames.length) {
        //console.log('Will delay next loop');
        // TODO : solve too much call issue ? delay for now...
        this.computeDelay(computeDelayMs, () => {
          loopFrames(idx);
        }); //.then(()=>{console.log('Delay OK')});
      }
    };
    loopFrames(0);

    function process(frame: Timing, frameIndex: number) {
      let file = frame.MediaUrl;
      if ('capture' !== frame.EventSource || typeof frame.MediaUrl !== 'string') {
        // It's unknonw Frame : TODO : show to end user...
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = '10px Arial';
        context.font = '10px Comic Sans MS';
        context.fillStyle = 'rgb(60,0,108)';
        context.textAlign = 'center';
        context.fillText('© Monwoo', canvas.width / 2, 12);
        context.font = '9px Arial';
        context.textAlign = 'left';
        context.fillText(frame.Comment, 0, 90);
        context.font = '7px Arial';
        context.fillText(
          `${frame.Date} ${frame.Time} - ` + `${frame.SubProject} [${frame.Objectif}]`,
          2,
          canvas.height - 7
        );

        capturer.capture(canvas);
        stackDelayFrame = 69; // will wait 42 frame, since recording at 24FPS ~ 2 sec ?

        finalizeFrame(frameIndex + 1, frames.length);
        return; // Done for non-pictures medias
      }

      var img = new Image();

      //load image and drop into canvas
      img.onload = function() {
        let drawInfos = () => {
          context.globalAlpha = 1;
          context.font = '10px Arial';
          context.font = '10px Comic Sans MS';
          context.fillStyle = 'rgb(60,0,108)'; // Primary color
          context.textAlign = 'center';
          context.fillText('© Monwoo', canvas.width / 2, 12);

          context.fillStyle = 'white';
          context.fillRect(0, canvas.height - 15, canvas.width, 10);

          context.fillStyle = 'rgb(60,0,108)'; // Primary color
          context.textAlign = 'left';
          context.font = '8px Arial';
          // context.strokeStyle = 'white'; // secondary color
          // context.strokeText(
          //   `${frame.Date} ${frame.Time} - `
          //   + `${frame.SubProject} [${frame.Objectif}]`
          //   , 2, canvas.height - 7);
          context.fillText(
            // White shadow to allow changing Bg
            `${frame.Date} ${frame.Time} - ` + `${frame.SubProject} [${frame.Objectif}]`,
            2,
            canvas.height - 7
          );
          // context.stroke();
          // context.fill();

          capturer.capture(canvas);
          //capturer.capture(canvas);
          //capturer.capture(canvas);

          // 25 fps = 1 sec of video...
          // => timing issue ? need delay ? give wrong video output...
          // => may have to do with timeOut overload ? one capture per changes only ?
          // [...Array(25)].forEach((_, i) => {
          //   // console.log(i);
          //   context.fillText(
          //     `${frame.Date} ${frame.Time} - `
          //     + `${frame.SubProject} [${frame.Objectif}]`
          //     , 2, canvas.height - 7);
          //   capturer.capture(canvas);
          // });
        };

        //a custom fade in and out slideshow
        context.globalAlpha = 0.2;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // video.add(context);
        drawInfos();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalAlpha = 0.4;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawInfos();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalAlpha = 0.6;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawInfos();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalAlpha = 0.8;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawInfos();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalAlpha = 1;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        //this should be a loop based on some user input
        drawInfos();

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalAlpha = 0.8;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawInfos();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalAlpha = 0.6;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawInfos();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalAlpha = 0.4;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawInfos();

        finalizeFrame(frameIndex + 1, frames.length);
        stackDelayFrame = 24;
      };
      img.src = self.medias.getDataUrlMedia(frame.MediaUrl);

      // TODO : from Api service ? :
      // var reader = new FileReader();
      // reader.onload = function(event:any) {
      //     var dataUri = event.target.result;
      //     var img = new Image();

      //     //load image and drop into canvas
      //     img.onload = function() {
      //         let drawInfos = () => {
      //           context.globalAlpha = 1;
      //           context.font = "10px Arial";
      //           context.font = "10px Comic Sans MS";
      //           context.fillStyle = "rgb(60,0,108)"; // Primary color
      //           context.textAlign = "center";
      //           context.fillText("© Monwoo", canvas.width/2, 12);

      //           context.fillStyle="white";
      //           context.fillRect(0,canvas.height - 15,canvas.width,10);

      //           context.fillStyle = "rgb(60,0,108)"; // Primary color
      //           context.textAlign = "left";
      //           context.font = "8px Arial";
      //           // context.strokeStyle = 'white'; // secondary color
      //           // context.strokeText(
      //           //   `${frame.Date} ${frame.Time} - `
      //           //   + `${frame.SubProject} [${frame.Objectif}]`
      //           //   , 2, canvas.height - 7);
      //           context.fillText( // White shadow to allow changing Bg
      //             `${frame.Date} ${frame.Time} - `
      //             + `${frame.SubProject} [${frame.Objectif}]`
      //             , 2, canvas.height - 7);
      //           // context.stroke();
      //           // context.fill();

      //           capturer.capture(canvas);
      //           //capturer.capture(canvas);
      //           //capturer.capture(canvas);

      //             // 25 fps = 1 sec of video...
      //             // => timing issue ? need delay ? give wrong video output...
      //             // [...Array(25)].forEach((_, i) => {
      //             //   // console.log(i);
      //             //   context.fillText(
      //             //     `${frame.Date} ${frame.Time} - `
      //             //     + `${frame.SubProject} [${frame.Objectif}]`
      //             //     , 2, canvas.height - 7);
      //             //   capturer.capture(canvas);
      //             // });
      //         }

      //         //a custom fade in and out slideshow
      //         context.globalAlpha = 0.2;
      //         context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //         // video.add(context);
      //         drawInfos();
      //         context.clearRect(0,0,context.canvas.width,context.canvas.height);
      //         context.globalAlpha = 0.4;
      //         context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //         drawInfos();
      //         context.clearRect(0,0,context.canvas.width,context.canvas.height);
      //         context.globalAlpha = 0.6;
      //         context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //         drawInfos();
      //         context.clearRect(0,0,context.canvas.width,context.canvas.height);
      //         context.globalAlpha = 0.8;
      //         context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //         drawInfos();
      //         context.clearRect(0,0,context.canvas.width,context.canvas.height);
      //         context.globalAlpha = 1;
      //         context.drawImage(img, 0, 0, canvas.width, canvas.height);

      //         //this should be a loop based on some user input
      //         drawInfos();

      //         context.clearRect(0,0,context.canvas.width,context.canvas.height);
      //         context.globalAlpha = 0.8;
      //         context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //         drawInfos();
      //         context.clearRect(0,0,context.canvas.width,context.canvas.height);
      //         context.globalAlpha = 0.6;
      //         context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //         drawInfos();
      //         context.clearRect(0,0,context.canvas.width,context.canvas.height);
      //         context.globalAlpha = 0.4;
      //         context.drawImage(img, 0, 0, canvas.width, canvas.height);
      //         drawInfos();

      //         finalizeFrame(frameIndex + 1, frames.length);
      //         stackDelayFrame = 24;
      //     };
      //     img.src = dataUri;
      // };

      // reader.onerror = function(event:any) {
      //     console.error("File could not be read! Code " + event.target.error.code);
      // };

      // let baseUrl = 'http://localhost:8000/api/fetch-media?url=';
      // self.http.get(baseUrl + encodeURIComponent(file), { responseType: 'blob' })
      // .subscribe((blob:Blob) => {
      //   if (blob) {
      //     reader.readAsDataURL(blob); // new File(blob, `frame-${frameIndex}.png`)
      //   } else {
      //     console.error('Fail to import frame : ', file);
      //   }
      // });
    }

    let finalizeFrame = (framePos: number, nbFrames: number) => {
      //check if its ready
      self.videoLoadPercent = Math.floor((100 * framePos) / nbFrames);
      console.log('Pivot Finalise Frames :', framePos, nbFrames);
      if (framePos == nbFrames) {
        capturer.stop();
        capturer.save();
      }
    };
  }

  downloadTimingsVideo() {
    this.exportsTimingsToVideoAsWebM();
  }

  saveChanges(t: Timing, k: string, v: any) {
    console.log('Save Change', t, k, v);
    t[k] = v;
    // TODO : call rest API with updated Obj
  }

  editTiming(t: Timing) {
    // TODO : need form => move to timing-form...
  }

  hideTiming(t: Timing) {
    // TODO : data store ?
    t.isHidden = true;
  }
  showTiming(t: Timing) {
    // TODO : data store ?
    t.isHidden = false;
  }
}
