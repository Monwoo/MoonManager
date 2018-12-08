// Copyright Monwoo 2018, made by Miguel Monwoo, service@monwoo.com
import { Action } from '@ngrx/store';
import { Timing } from '../api/data-model/timing';

export enum ActionTypes {
  SetTimings = '[TimingsBuffer Service] SetTimings',
  AddTimings = '[TimingsBuffer Service] AddTimings'
}

export class SetTimings implements Action {
  readonly type = ActionTypes.SetTimings;

  constructor(public timings: Timing[]) {}
}

export class AddTimings implements Action {
  readonly type = ActionTypes.AddTimings;

  constructor(public timings: Timing[]) {}
}

export type ActionsUnion = SetTimings | AddTimings;
