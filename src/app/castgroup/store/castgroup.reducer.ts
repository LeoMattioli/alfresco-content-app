import * as CastgroupActions from './castgroup.actions';
import { DisplayMode } from '@alfresco/adf-core';

export interface CastgroupState {
  vista: string;
  vistaSelezionata: number;
}

export const initialState: CastgroupState = {
  vista: DisplayMode.Gallery,
  vistaSelezionata: 0
};

export function castgroupReducer(
  state: CastgroupState = initialState,
  action: CastgroupActions.CastgroupActions
) {
  console.log(`Chiamato Reducer: ${action.type}`);
  switch (action.type) {
    case CastgroupActions.AZIONE_UNO:
      console.log(`switching view`);

      return {
        ...state,
        vista:
          state.vista === DisplayMode.Gallery
            ? DisplayMode.List
            : DisplayMode.Gallery
      };
    case CastgroupActions.LISTA_UNO:
      console.log('lista 1');
      return {
        ...state,
        vistaSelezionata: 0
      };
    case CastgroupActions.LISTA_DUE:
      console.log('lista 1');
      return {
        ...state,
        vistaSelezionata: 1
      };
    default:
      return state;
  }
}

/* per conoscenza, con la sintassi NgRx 9, si può scrivere anche così
import { Action, createReducer, on } from '@ngrx/store';
import * as CastgroupActions from './castgroup.actions';

export interface CastgroupState {
  flag1: boolean;
  list1: any[];
}

const CASTGROUP_INITIAL_STATE: CastgroupState = {
  flag1: true,
  list1: []
};

export function castgroupReducer(
  castState: CastgroupState = CASTGROUP_INITIAL_STATE,
  castAction: Action
) {
  console.log(`Chiamato Reducer:`);
  return createReducer(
    CASTGROUP_INITIAL_STATE,
    on(CastgroupActions.doAzione1, (state, action) => ({
      ...state,
      ...action
    })),
    on(CastgroupActions.doAzione2, (state, action) => ({ ...state, ...action }))
  )(castState, castAction);
}
 */
