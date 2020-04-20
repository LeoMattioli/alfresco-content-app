import { Action } from '@ngrx/store';
import { ResultSetRowEntry } from '@alfresco/js-api';
import { DocumentsConfig } from '../shared/incomplete-model';

export const SWITCH_VIEW = '[CastGroup] Switch view';

export const LISTA_X = '[CastGroup] Vista 1';
export const LISTA_XY = '[CastGroup] Vista 2';
export const LOADING_INCOMPLETE_CONFIG = '[CastGroup] Start Load Incompl Conf';
export const LOAD_INCOMPLETE_CONFIG = '[CastGroup] Incompl Conf Load ResultSet';
export const LOAD_CONFIG_ID_START = '[CastGroup] Start Load Config ID';
export const LOAD_CONFIG_ID_DONE = '[CastGroup] Config ID Loaded';

export class SwitchView implements Action {
  readonly type = SWITCH_VIEW;

  constructor(public payload: string) {}
}

export class ViewListaX implements Action {
  readonly type = LISTA_X;
}

export class ViewListaXY implements Action {
  readonly type = LISTA_XY;
}
export class LoadingIncompleteDocsConfig implements Action {
  readonly type = LOADING_INCOMPLETE_CONFIG;
}

export class LoadIncompleteDocsConfig implements Action {
  readonly type = LOAD_INCOMPLETE_CONFIG;
  constructor(public payload: ResultSetRowEntry[]) {}
}

export class LoadingIncompleteDocsConfigById implements Action {
  readonly type = LOAD_CONFIG_ID_START;
  constructor(public payload: { idx: number; config: DocumentsConfig }) {}
}

export class LoadIncompleteDocsConfigById implements Action {
  readonly type = LOAD_CONFIG_ID_DONE;
  constructor(public payload: any[]) {}
}

export type CastgroupActions =
  | SwitchView
  | ViewListaX
  | ViewListaXY
  | LoadingIncompleteDocsConfig
  | LoadIncompleteDocsConfig
  | LoadingIncompleteDocsConfigById
  | LoadIncompleteDocsConfigById;

/* Con la sintassi di NgRx 9 questa si può scrivere così
import { createAction, props } from '@ngrx/store';

export const doAzione1 = createAction('[CastGroup] Azione 1');
export const doAzione2 = createAction(
  '[CastGroup] Azione 2',
  props<{ email: string; password: string }>()
);
*/
