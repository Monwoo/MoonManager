// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  DynamicFormModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';
import { extract } from '@app/core';

// import { I18n } from '@ngx-translate/i18n-polyfill';

export const configDefaults: ((caller: any) => any) = (caller?: any) => ({
  paramTitle: caller.i18n('Client file loader param title|Chargement des captures@@mm.cfl.paramTitle'),
  timingEventType: 'capture',
  timingAuthor: caller.i18n('John Doe|John Doe@@mm.cfl.timingAuthor'),
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

export const configFormModel = (caller: any) => {
  return [
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

      placeholder: caller.i18n(
        "RegEx for Captures|Expressions régulière pour la source : 'capture'@@mm.cfl.captureRegex.placeholder"
      ),
      multiple: true,
      //minLength: 150,

      // value: ["hotel", "booking"]
      value: caller.config.captureRegex
    }),
    new DynamicInputModel({
      id: 'thumbW',
      label: caller.i18n('Thumbnail width|Largeur du thumbnaile@@mm.cfl.thumbW.label'),
      inputType: 'number',
      placeholder: caller.i18n('Width|Largeur@@mm.cfl.thumbW.placeholder'),
      value: caller.config.thumbW // well, ovewritten by param config obj loaded from storage...
    }),
    new DynamicInputModel({
      id: 'thumbH',
      label: caller.i18n('Thumbnail height|Hauteur du thumbnaile@@mm.cfl.thumbW.label'),
      inputType: 'number',
      placeholder: caller.i18n('Height|Hauteur@@mm.cfl.thumbW.placeholder'),
      value: caller.config.thumbH // well, ovewritten by param config obj loaded from storage...
    })
  ];
};
