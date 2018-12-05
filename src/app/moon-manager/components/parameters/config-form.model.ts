// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  DynamicFormModel,
  DynamicFormGroupModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';

import { configDefaults as cflConfig } from '../client-files-loader/config-form.model';
import { configFormModel as cflConfigForm } from '../client-files-loader/config-form.model';
import { CONFIG_FORM_LAYOUT as cflConfigLayout } from '../client-files-loader/config-form.model';

import { configDefaults as pivotConfig } from '../timing-pivot/config-form.model';
import { configFormModel as pivotConfigForm } from '../timing-pivot/config-form.model';
import { CONFIG_FORM_LAYOUT as pivotConfigLayout } from '../timing-pivot/config-form.model';

// TODO :
// export const paramGroups = [
//   {
//     selector:'moon-manager-client-files-loader',
//     etc...
//   }
// ];

// TODO : build with above done stuff...
export const paramSelectors = ['moon-manager-client-files-loader', 'moon-manager-timing-pivot'];

const groupBySelectors = {
  'moon-manager-client-files-loader': cflConfigForm,
  'moon-manager-timing-pivot': pivotConfigForm
};
const configBySelectors = (caller: any) => {
  return new Promise(function(resolve, reject) {
    (async () => {
      const _debugConfig = await cflConfig(caller);
      const _debugParamTitle = _debugConfig.paramTitle;
      resolve({
        'moon-manager-client-files-loader': {
          label: _debugParamTitle
        },
        'moon-manager-timing-pivot': {
          label: (await pivotConfig(caller)).paramTitle
        }
      });
    })();
  });
};

// TODO : how to custom layout for embed form with NO html code ?
// Need some code pattern to avoid id's clash ?
export const CONFIG_FORM_LAYOUT = {
  ...{
    'moon-manager-client-files-loader': {
      // TODO : better id Unique system for whole app...
      element: {
        // container: 'w-100'
        label: 'param-title'
      }
      // grid: {
      //   //     control: "col-sm-9",
      //   label: "param-title",
      // }
    },
    'moon-manager-timing-pivot': {
      element: {
        label: 'param-title'
      }
    }
  },
  ...cflConfigLayout,
  ...pivotConfigLayout
};

// export const CONFIG_FORM_MODEL: DynamicFormModel = Object.keys(groupBySelectors).map(s => {
export const configFormModel = (caller: any) => {
  return new Promise<DynamicFormGroupModel[]>(function(resolve, reject) {
    // async () => { => await error : do no take this Async context...
    //   resolve(Object.keys(groupBySelectors).map(s => {
    //     return new DynamicFormGroupModel({
    //       ...{
    //         id: s,
    //         group: await groupBySelectors[s](caller),
    //       },
    //       ...configBySelectors[s]
    //     });
    //   }));
    // }
    const selectorsKeys = Object.keys(groupBySelectors);
    let groups: DynamicFormGroupModel[] = [];
    (async () => {
      for (let i = 0; i < selectorsKeys.length; i++) {
        const s = selectorsKeys[i];
        const configBySelectorsDict = await configBySelectors(caller);

        groups.push(
          new DynamicFormGroupModel({
            ...{
              id: s,
              group: await groupBySelectors[s](caller)
            },
            ...configBySelectorsDict[s]
          })
        );
      }
      resolve(groups);
    })();
  });
};
