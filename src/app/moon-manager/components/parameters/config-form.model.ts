// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  DynamicFormModel,
  DynamicFormGroupModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';

import { CONFIG_FORM_MODEL as cflConfigForm } from '../client-files-loader/config-form.model';
import { CONFIG_FORM_LAYOUT as cflConfigLayout } from '../client-files-loader/config-form.model';

import { CONFIG_FORM_MODEL as pivotConfigForm } from '../timing-pivot/config-form.model';
import { CONFIG_FORM_LAYOUT as pivotConfigLayout } from '../timing-pivot/config-form.model';

const groupBySelectors = {
  'moon-manager-client-files-loader': cflConfigForm,
  'moon-manager-timing-pivot': pivotConfigForm
};
const configBySelectors = {
  'moon-manager-client-files-loader': {
    label: 'Paramètres du chargement des dossiers/fichiers :' // TODO : translation
  },
  'moon-manager-timing-pivot': {
    label: 'Paramètres du pivot temporel :' // TODO : translation
  }
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

export const CONFIG_FORM_MODEL: DynamicFormModel = Object.keys(groupBySelectors).map(s => {
  return new DynamicFormGroupModel({
    ...{
      id: s,
      group: groupBySelectors[s]
    },
    ...configBySelectors[s]
  });
});