// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  DynamicFormModel,
  DynamicFormGroupModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';

import { CONFIG_FORM_MODEL as cflConfigForm } from '../client-files-loader/config-form.model';
import { CONFIG_FORM_LAYOUT as cflConfigLayout } from '../client-files-loader/config-form.model';

const groupBySelectors = {
  'moon-manager-client-files-loader': cflConfigForm
};

// TODO : loop over all selectors
const selected = 'moon-manager-client-files-loader';

// TODO : how to custom layout for embed form with NO html code ?
// Need some code pattern to avoid id's clash ?
export const CONFIG_FORM_LAYOUT = {
  ...{},
  ...cflConfigLayout
};

export const CONFIG_FORM_MODEL: DynamicFormModel = [
  new DynamicFormGroupModel({
    id: selected,
    label: 'Paramètres du chargement des dossiers/fichiers :', // TODO : translation
    group: groupBySelectors[selected]
  })
];
