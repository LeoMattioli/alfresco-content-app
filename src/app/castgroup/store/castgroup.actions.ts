import { Action } from '@ngrx/store';

export const AZIONE_UNO = '[CastGroup] Switch view';

export const LISTA_UNO = '[CastGroup] Vista 1';
export const LISTA_DUE = '[CastGroup] Vista 2';

export class DoAzione1 implements Action {
  readonly type = AZIONE_UNO;

  constructor(public payload: string) {}
}

export class DoLista1 implements Action {
  readonly type = LISTA_UNO;

  constructor(public payload: string) {}
}

export class DoLista2 implements Action {
  readonly type = LISTA_DUE;

  constructor(public payload: string) {}
}

export type CastgroupActions = DoAzione1 | DoLista1 | DoLista2;

/* Con la sintassi di NgRx 9 questa si può scrivere così
import { createAction, props } from '@ngrx/store';

export const doAzione1 = createAction('[CastGroup] Azione 1');
export const doAzione2 = createAction(
  '[CastGroup] Azione 2',
  props<{ email: string; password: string }>()
);
*/
