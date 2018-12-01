// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  DynamicFormModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';
import { extract } from '@app/core';

export const ConfigDefaults: ((caller?: any) => any) = (caller?: any) => ({
  paramTitle: extract('Pivot temporel'),
  agregationsFields: ['Author', 'Project', 'SubProject', 'Objectif', 'Date', 'Time'],
  billedDays: 0,
  paidDays: 0,
  compensatedDays: 0,
  receivedDays: 0,
  summaryTitle: extract("Compte rendu d'activité de M. John Doe"),
  videoCopyright: extract('© Monwoo (Private data)'),
  videoFontColor: extract('rgb(60,0,108)'),
  lowRes: false
});

const _conf = ConfigDefaults();

export const CONFIG_FORM_LAYOUT = {
  // https://github.com/udos86/ng-dynamic-forms/blob/bfea1d8b/packages/core/src/model/misc/dynamic-form-control-layout.model.ts#L8
  //

  summaryTitle: {
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
  new DynamicInputModel({
    id: 'videoCopyright',
    label: extract('Titre de la vidéo'), // TODO : translate
    maxLength: 69,
    placeholder: extract('Copyright de la vidéo')
  }),

  new DynamicInputModel({
    id: 'videoFontColor',
    label: extract('Couleur du text vidéo'), // TODO : translate
    maxLength: 69,
    placeholder: extract('Couleur du text')
  }),

  new DynamicCheckboxModel({
    id: 'lowRes',
    label: extract('Activer le mode vidéo basse résolution')
  }),

  new DynamicInputModel({
    id: 'summaryTitle',
    label: extract("Titre pour le comptre rendue d'activité"),
    placeholder: extract('Votre titre')
  }),

  new DynamicInputModel({
    id: 'billedDays',
    inputType: 'number',
    placeholder: extract('Nombre de jours facturé'),
    // hint: "La somme de vos factures en jours",
    hint: extract('Total jours facturés')
    // max: 5,
    // min: 0
  }),
  new DynamicInputModel({
    id: 'paidDays',
    inputType: 'number',
    placeholder: extract('Nombre de jours payé'),
    // hint: "La somme de vos encaissements à jours",
    hint: extract('Total jours encaissés')
    // max: 5,
    // min: 0
  }),
  new DynamicInputModel({
    id: 'compensatedDays',
    inputType: 'number',
    // placeholder: "Nombre de jours via compensation diverse négocié",
    // hint: "La somme des compensations non facturés admise",
    placeholder: extract('Compensations négociées aquises en jours'),
    hint: extract('Total jours compensés')
    // max: 5,
    // min: 0
  }),
  new DynamicInputModel({
    id: 'receivedDays',
    inputType: 'number',
    // placeholder: "Nombre de jours compensé",
    // hint: "Compensations diverses reçues en jours",
    placeholder: extract('Compensations reçuses en jours'),
    hint: extract('Total jours reçus')
    // max: 5,
    // min: 0
  })
];
