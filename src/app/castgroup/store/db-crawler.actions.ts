import { Action } from '@ngrx/store';
import { DbCrawlerConfig } from '../shared/db-crawler-model';

export const LOAD_CONF_START = '[CastGroup]Load_conf_start';
export const LOAD_CONF_SUCCESS = '[CastGroup]Load_conf_success';
export const SAVE_CONF_START = '[CastGroup]Save_conf_start';
export const SAVE_CONF_SUCCESS = '[CastGroup]Save_conf_success';
export const SAVE_CONF_FAILURE = '[CastGroup]Save_conf_failure';

export class LoadConfStart implements Action {
  readonly type = LOAD_CONF_START;
}

export class LoadConfSuccess implements Action {
  readonly type = LOAD_CONF_SUCCESS;

  constructor(public payload: DbCrawlerConfig[]) {}
}

export class SaveConfStart implements Action {
  readonly type = SAVE_CONF_START;

  constructor(public payload: DbCrawlerConfig) {}
}

export class SaveConfSuccess implements Action {
  readonly type = SAVE_CONF_SUCCESS;

  constructor(public payload: string) {}
}

export class SaveConfFailure implements Action {
  readonly type = SAVE_CONF_FAILURE;

  constructor(public payload: string) {}
}

export type DbCrawlerActions =
  | LoadConfStart
  | LoadConfSuccess
  | SaveConfStart
  | SaveConfSuccess
  | SaveConfFailure;
