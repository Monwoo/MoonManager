// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  DynamicFormModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';

export const ConfigDefaults: ((caller?: any) => any) = (caller?: any) => ({
  paramTitle: 'Pivot temporel', // TODO translations
  agregationsFields: ['Author', 'Project', 'SubProject', 'Objectif', 'Date', 'Time'],
  billedDays: 0,
  paidDays: 0,
  compensatedDays: 0,
  receivedDays: 0,
  summaryTitle: "Compte rendu d'activité de M. John Doe",
  videoCopyright: '© Monwoo (Private data)',
  videoFontColor: 'rgb(60,0,108)',
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
    label: 'Titre de la vidéo', // TODO : translate
    maxLength: 69,
    placeholder: 'Copyright de la vidéo'
  }),

  new DynamicInputModel({
    id: 'videoFontColor',
    label: 'Couleur du text vidéo', // TODO : translate
    maxLength: 69,
    placeholder: 'Couleur du text'
  }),

  new DynamicCheckboxModel({
    id: 'lowRes',
    label: 'Activer le mode vidéo basse résolution'
  }),

  new DynamicInputModel({
    id: 'summaryTitle',
    label: "Titre pour le comptre rendue d'activité",
    placeholder: 'Votre titre'
  }),

  new DynamicInputModel({
    id: 'billedDays',
    inputType: 'number',
    placeholder: 'Nombre de jours facturé',
    // hint: "La somme de vos factures en jours",
    hint: 'Total jours facturés'
    // max: 5,
    // min: 0
  }),
  new DynamicInputModel({
    id: 'paidDays',
    inputType: 'number',
    placeholder: 'Nombre de jours payé',
    // hint: "La somme de vos encaissements à jours",
    hint: 'Total jours encaissés'
    // max: 5,
    // min: 0
  }),
  new DynamicInputModel({
    id: 'compensatedDays',
    inputType: 'number',
    // placeholder: "Nombre de jours via compensation diverse négocié",
    // hint: "La somme des compensations non facturés admise",
    placeholder: 'Compensations négociées aquises en jours',
    hint: 'Total jours compensés'
    // max: 5,
    // min: 0
  }),
  new DynamicInputModel({
    id: 'receivedDays',
    inputType: 'number',
    // placeholder: "Nombre de jours compensé",
    // hint: "Compensations diverses reçues en jours",
    placeholder: 'Compensations reçuses en jours',
    hint: 'Total jours reçus'
    // max: 5,
    // min: 0
  })
];
