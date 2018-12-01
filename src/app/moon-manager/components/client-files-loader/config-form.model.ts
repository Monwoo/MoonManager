// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  DynamicFormModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';
import { extract } from '@app/core';

export const ConfigDefaults: ((caller?: any) => any) = (caller?: any) => ({
  paramTitle: extract('Chargement des captures'), // TODO translations
  timingEventType: 'capture',
  timingAuthor: extract('John Doe'),
  timingSegmentDelta: 0.2,
  // TODO : improve Parameters up to deep properties lookup with auto-gen forms for edit
  // then transform below captureRegex to flexible array....
  captureRegex: [
    '.*Capture d’écran ([0-9]{4})-([0-9]{2})-([0-9]{2}) à ([0-9]{2}).([0-9]{2}).([0-9]{2}).*.(png|jpg|jpeg)',
    '.*Screenshot ([0-9]{4})-([0-9]{2})-([0-9]{2}) at ([0-9]{2}).([0-9]{2}).([0-9]{2}).*.(png|jpg|jpeg)',
    // 20181129_165121.jpg ou 2018_11_28_23_55_04.png
    '.*([0-9]{4})_?([0-9]{2})_?([0-9]{2})_([0-9]{2})_?([0-9]{2})_?([0-9]{2}).*.(png|jpg|jpeg)'
  ],
  thumbW: 700,
  thumbH: 400,
  regExGitLogFile: '.*.csv',
  regExAuthor: '^[^/]+/([^/]+)/',
  regExProject: '^[^/]+/[^/]+/([^/]+)/',
  regExSubProject: '^[^/]+/[^/]+/[^/]+/([^/]+)/',
  regExObjectif: '^[^/]+/[^/]+/[^/]+/[^/]+/([^/]+)/',
  regExSkillsId: '^[^/]+/[^/]+/[^/]+/[^/]+/[^/]+/([^/]+)/'
});

const _conf = ConfigDefaults();

export const CONFIG_FORM_LAYOUT = {
  // https://github.com/udos86/ng-dynamic-forms/blob/bfea1d8b/packages/core/src/model/misc/dynamic-form-control-layout.model.ts#L8
  //

  captureRegex: {
    // TODO : better id Unique system for whole app...
    element: {
      container: 'w-100'
    }
    // grid: {
    //     control: "col-sm-9",
    //     label: "col-sm-3"
    // }
  }
};

export const CONFIG_FORM_MODEL: DynamicFormModel = [
  // TODO : tool to auto gen ? or always time lost since design of form will bring back to specific.. ?
  // new DynamicInputModel({
  //   id: 'paramTitle',
  //   label: 'Titre de la config', // TODO : translate
  //   maxLength: 42,
  //   placeholder: 'Votre titre'
  // }),

  // new DynamicInputModel({
  //   id: 'timingAuthor',
  //   label: 'Autheur à inspecter', // TODO : translate
  //   maxLength: 42,
  //   placeholder: "Nom d'autheur à regrouper"
  // }),

  new DynamicInputModel({
    id: 'captureRegex',
    // TODO : need to link language, extract is only TAGGING as translatable, not doing the translation...
    // TODO :
    // https://www.jonashendrickx.com/2017/12/06/await-observable-complete-angular/
    // private getTranslations(keys: string[]): Promise<any> {
    //   return new Promise((resolve, reject) => {
    //     this.translateSvc.get(keys).subscribe(success => {
    //       resolve(success);
    //     });
    //   });
    // }

    placeholder: extract("Expressions régulière pour la source : 'capture'"),
    multiple: true,
    //minLength: 150,

    // value: ["hotel", "booking"]
    value: _conf.captureRegex
  }),
  new DynamicInputModel({
    id: 'thumbW',
    label: extract('Largeur du thumbnail'), // TODO : translate
    inputType: 'number',
    placeholder: 'Largeur',
    value: _conf.thumbW // well, ovewritten by param config obj loaded from storage...
  }),
  new DynamicInputModel({
    id: 'thumbH',
    label: extract('Hauteur du thumbnail'), // TODO : translate
    inputType: 'number',
    placeholder: 'Hauteur',
    value: _conf.thumbH // well, ovewritten by param config obj loaded from storage...
  })
];
