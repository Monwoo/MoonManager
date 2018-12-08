// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com
import { Action } from '@ngrx/store';
import { Timing } from '../api/data-model/timing';

export enum ActionTypes {
  SetTimings = '[TimingsBuffer Service] SetTimings'
  // ResetTimings = '[TimingsBuffer Service] ResetTimings',
}
export class SetTimings implements Action {
  readonly type = ActionTypes.SetTimings;

  constructor(public timings: Timing[]) {}
}

// export class ResetTimings implements Action {
//   readonly type = ActionTypes.ResetTimings;
// }

export type ActionsUnion = SetTimings; // | ResetTimings;
