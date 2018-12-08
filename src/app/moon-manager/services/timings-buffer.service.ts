// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com
import { Injectable } from '@angular/core';
import { Timing } from '../api/data-model/timing';

import { Store, select, ActionReducer, MetaReducer } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActionTypes, ActionsUnion, SetTimings } from './timings-buffer.actions';

// import { Effect, Actions, ofType } from '@ngrx/effects'; // import ofType operator
// // https://ngrx.io/guide/migration/v7
// @Injectable()
// export class MyEffects {
//   @Effect()
//   someEffect$: Observable<Action> = this.actions$.pipe(
//     ofType(UserActions.LOGIN), // use the pipeable ofType operator
//     map(() => new AnotherAction())
//   );
//   constructor(private actions$: Actions) {}
// }

export type StateType = {
  data: Timing[];
};

export const initialState: StateType = {
  data: []
};

export function timingsReducer(state = initialState, action: ActionsUnion) {
  switch (action.type) {
    case ActionTypes.SetTimings: {
      state.data = action.timings;
    }
    default: {
    }
  }
  return state;
}

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

@Injectable({
  providedIn: 'root'
})
export class TimingsBufferService {
  dataTimings: Observable<Timing[]>;

  constructor(private store: Store<{ timings: Timing[] }>) {
    this.dataTimings = store.pipe(select('timings'));
  }

  async hasChanges() {
    return (await this.dataTimings.toPromise()).length > 0;
  }

  async get() {
    return await this.dataTimings;
  }

  async set(datas: Timing[]) {
    this.store.dispatch(new SetTimings(datas));
    return await this.dataTimings;
  }

  async clear() {
    this.store.dispatch(new SetTimings([]));
    return await this.dataTimings;
  }
}
