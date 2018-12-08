// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com
import { ActionReducer, MetaReducer } from '@ngrx/store';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}
// Midelware list for Actions system
// https://ngrx.io/guide/store/metareducers
// https://ngrx.io/guide/store/recipes/injecting
export const metaReducers: MetaReducer<any>[] = [debug];
