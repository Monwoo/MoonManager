// Copyright Monwoo 2018, by Miguel Monwoo, service@monwoo.com
export class Timing {
  // API Fields
  id: number;
  DateTime: Date;
  EventSource: string;
  ExpertiseLevel: string;
  Project: string;
  SubProject: string;
  Objectif: string;
  Title: string;
  MediaUrl: string;
  Author: string;
  Comment: string;
  ReviewedComment: string;
  OverrideSequence: string;
  OverrideReduction: string;
  SegmentOverride: number;
  SegmentMin: Date;
  SegmentDeltaHr: number;
  SegmentMax: Date;
  Date: string;
  Time: string;
  Month: string;
  Year: string;
  SkillsId: string;
  // Client side computed fields :
  LinearWorkloadAmount: number;
  WorkloadAmount: number;
  TJM: number;
  TJMWorkloadByDay: number;
  Price: number;
  isHidden: boolean;
}
