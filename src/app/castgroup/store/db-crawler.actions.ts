import { Action } from '@ngrx/store';

export const LOAD_CONF_START = '[CastGroup]Load_conf_start';
export const LOAD_CONF_SUCCESS = '[CastGroup]Load_conf_success';

export const LOAD_CONF_ID_START = '[CastGroup]Load_conf_id_start';
export const LOAD_CONF_ID_SUCCESS = '[CastGroup]Load_conf_id_success';

export class LoadConfStart implements Action {
  readonly type = LOAD_CONF_START;
}

export class LoadConfSuccess implements Action {
  readonly type = LOAD_CONF_SUCCESS;

  constructor(public payload: string) {}
}

export class LoadConfIdStart implements Action {
  readonly type = LOAD_CONF_ID_START;

  constructor(public payload: string) {}
}
export class LoadConfIdSuccess implements Action {
  readonly type = LOAD_CONF_ID_SUCCESS;

  constructor(public payload: string) {}
}

export type DbCrawlerActions =
  | LoadConfStart
  | LoadConfSuccess
  | LoadConfIdStart
  | LoadConfIdSuccess;
