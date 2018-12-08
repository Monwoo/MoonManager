// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com
import { Injectable } from '@angular/core';
import { Timing } from '../api/data-model/timing';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TimingsActionTypes, TimingsActionsUnion, SetTimings, AddTimings } from './timings-buffer.actions';

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

export function timingsReducer(state = initialState, action: TimingsActionsUnion) {
  switch (action.type) {
    case TimingsActionTypes.SetTimings: {
      state.data = action.timings;
    }
    case TimingsActionTypes.AddTimings: {
      state.data = state.data.concat(action.timings);
    }
    default: {
    }
  }
  return state;
}

@Injectable({
  providedIn: 'root'
})
export class TimingsBufferService {
  dataTimings: Observable<Timing[]>;
  bulk: Timing[] = [];

  constructor(private store: Store<{ timings: Timing[] }>) {
    this.dataTimings = store.pipe(select('timings'));
  }

  async hasChanges() {
    return (await this.dataTimings.toPromise()).length > 0;
  }

  // Will return a Copy of timings, modification to this array may not change source...
  async get() {
    return await this.dataTimings.toPromise();
  }

  // async exist(query:Timing)

  // Insert timings with default bulk submit when size goese over bulkAfter value
  async addBulk(datas: Timing[], bulkAfter = 200) {
    this.bulk = this.bulk.concat(datas);
    if (this.bulk.length > bulkAfter) {
      this.store.dispatch(new AddTimings(this.bulk));
      this.bulk = [];
    }
    return await this.dataTimings;
  }

  // Will submit pending bulk if some data is pending
  async finalizeBulks() {
    this.store.dispatch(new AddTimings(this.bulk));
    this.bulk = [];
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
