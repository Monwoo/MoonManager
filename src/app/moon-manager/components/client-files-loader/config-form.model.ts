// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  DynamicFormModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';

export const ConfigForm: DynamicFormModel = [
  new DynamicInputModel({
    id: 'sampleInput',
    label: 'Sample Input',
    maxLength: 42,
    placeholder: 'Sample input'
  }),

  new DynamicRadioGroupModel<string>({
    id: 'sampleRadioGroup',
    label: 'Sample Radio Group',
    options: [
      {
        label: 'Option 1',
        value: 'option-1'
      },
      {
        label: 'Option 2',
        value: 'option-2'
      },
      {
        label: 'Option 3',
        value: 'option-3'
      }
    ],
    value: 'option-3'
  }),

  new DynamicCheckboxModel({
    id: 'sampleCheckbox',
    label: 'I do agree'
  })
];

export const ConfigDefaults: ((caller?: any) => {}) = (caller?: any) => ({
  paramTitle: 'Chargement des captures', // TODO translations
  timingEventType: 'capture',
  timingAuthor: 'John Doe',
  timingSegmentDelta: 0.2,
  // TODO : improve Parameters up to deep properties lookup with auto-gen forms for edit
  // then transform below captureRegex to flexible array....
  captureRegex_0: '.*Capture d’écran ([0-9]{4})-([0-9]{2})-([0-9]{2}) ' + 'à ([0-9]{2}).([0-9]{2}).([0-9]{2}).*.png',
  captureRegex_1: '.*Screenshot ([0-9]{4})-([0-9]{2})-([0-9]{2}) ' + 'at ([0-9]{2}).([0-9]{2}).([0-9]{2}).*.png',
  // 20181129_165121 ou 2018_11_28_23_55_04
  captureRegex_2: '.*([0-9]{4})_?([0-9]{2})_?([0-9]{2})_([0-9]{2})_?([0-9]{2})_?([0-9]{2}).*.png',
  thumbW: 700,
  thumbH: 400,
  regExGitLogFile: '.*.csv',
  regExAuthor: '^[^/]+/([^/]+)/',
  regExProject: '^[^/]+/[^/]+/([^/]+)/',
  regExSubProject: '^[^/]+/[^/]+/[^/]+/([^/]+)/',
  regExObjectif: '^[^/]+/[^/]+/[^/]+/[^/]+/([^/]+)/',
  regExSkillsId: '^[^/]+/[^/]+/[^/]+/[^/]+/[^/]+/([^/]+)/'
});
