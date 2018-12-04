// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com

import {
  DynamicFormControlModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from '@ng-dynamic-forms/core';
import { extract } from '@app/core';
import { Logger } from '@app/core/logger.service';
const MonwooReview = new Logger('MonwooReview');

export const configDefaults: ((caller: any) => any) = (caller?: any) => ({
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
  },
  lowRes: {
    element: {
      container: 'checkbox-form-field'
    }
  }
};

// export const CONFIG_FORM_MODEL: DynamicFormModel = [
export const configFormModel = (caller: any) => {
  const config = configDefaults(caller);
  const translate = caller.i18nService;
  const fetchTrans = (t: string) =>
    new Promise<string>(r =>
      translate.get(extract(t)).subscribe((t: string) => {
        r(t);
      })
    ).catch(e => {
      MonwooReview.debug('Fail to translate', e);
      // throw 'Translation issue';
      return ''; // will be taken as await result on errors
    });
  return new Promise<DynamicFormControlModel[]>(function(resolve, reject) {
    (async () => {
      resolve([
        // TODO : tool to auto gen ? or always time lost since design of form will bring back to specific.. ?
        // new DynamicInputModel({
        //   id: 'paramTitle',
        //   label: 'Titre de la config', // TODO : translate
        //   maxLength: 42,
        //   placeholder: 'Votre titre'
        // }),
        new DynamicInputModel({
          id: 'videoCopyright',
          label: await fetchTrans('Titre de la vidéo'), // TODO : translate
          maxLength: 69,
          placeholder: await fetchTrans('Copyright de la vidéo')
        }),

        new DynamicInputModel({
          id: 'videoFontColor',
          label: await fetchTrans('Couleur du text vidéo'), // TODO : translate
          maxLength: 69,
          placeholder: await fetchTrans('Couleur du text')
        }),

        new DynamicCheckboxModel({
          id: 'lowRes',
          label: await fetchTrans('Activer le mode vidéo basse résolution')
        }),

        new DynamicInputModel({
          id: 'summaryTitle',
          label: await fetchTrans("Titre pour le comptre rendue d'activité"),
          placeholder: await fetchTrans('Votre titre')
        }),

        new DynamicInputModel({
          id: 'billedDays',
          inputType: 'number',
          placeholder: await fetchTrans('Nombre de jours facturé'),
          // hint: "La somme de vos factures en jours",
          hint: await fetchTrans('Total jours facturés')
          // max: 5,
          // min: 0
        }),
        new DynamicInputModel({
          id: 'paidDays',
          inputType: 'number',
          placeholder: await fetchTrans('Nombre de jours payé'),
          // hint: "La somme de vos encaissements à jours",
          hint: await fetchTrans('Total jours encaissés')
          // max: 5,
          // min: 0
        }),
        new DynamicInputModel({
          id: 'compensatedDays',
          inputType: 'number',
          // placeholder: "Nombre de jours via compensation diverse négocié",
          // hint: "La somme des compensations non facturés admise",
          placeholder: await fetchTrans('Compensations négociées aquises en jours'),
          hint: await fetchTrans('Total jours compensés')
          // max: 5,
          // min: 0
        }),
        new DynamicInputModel({
          id: 'receivedDays',
          inputType: 'number',
          // placeholder: "Nombre de jours compensé",
          // hint: "Compensations diverses reçues en jours",
          placeholder: await fetchTrans('Compensations reçuses en jours'),
          hint: await fetchTrans('Total jours reçus')
          // max: 5,
          // min: 0
        })
      ]);
    })();
  });
};
