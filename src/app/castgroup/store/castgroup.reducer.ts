import * as CastgroupActions from './castgroup.actions';
import { DisplayMode } from '@alfresco/adf-core';
import { DocumentsConfig } from '../shared/incomplete-model';

export interface CastgroupState {
  vista: string;
  vistaSelezionata: number;
  incompleteDocs: {
    loading: boolean;
    configArray: DocumentsConfig[];
    selectedConf: number;
    result: any[];
  };
}

export const initialState: CastgroupState = {
  vista: DisplayMode.Gallery,
  vistaSelezionata: 0,
  incompleteDocs: {
    loading: false,
    configArray: null,
    selectedConf: -1,
    result: null
  }
};

export function castgroupReducer(
  state: CastgroupState = initialState,
  action: CastgroupActions.CastgroupActions
) {
  //console.log(`Chiamato Reducer: ${action.type}`);
  switch (action.type) {
    case CastgroupActions.SWITCH_VIEW:
      return {
        ...state,
        vista:
          state.vista === DisplayMode.Gallery
            ? DisplayMode.List
            : DisplayMode.Gallery
      };
    case CastgroupActions.LISTA_X:
      return {
        ...state,
        vistaSelezionata: 0
      };
    case CastgroupActions.LISTA_XY:
      return {
        ...state,
        vistaSelezionata: 1
      };
    case CastgroupActions.LOADING_INCOMPLETE_CONFIG:
      return {
        ...state,
        incompleteDocs: {
          loading: true
          // configArray: []  //commento per evitare una catena di eventi
        }
      };
    case CastgroupActions.LOAD_INCOMPLETE_CONFIG:
      return {
        ...state,
        incompleteDocs: {
          loading: false,
          configArray: action.payload
        }
      };
    case CastgroupActions.LOAD_CONFIG_ID_START:
      return {
        ...state,
        incompleteDocs: {
          selectedConf: action.payload.idx,
          configArray: state.incompleteDocs.configArray,
          loading: state.incompleteDocs.loading
        }
      };
    case CastgroupActions.LOAD_CONFIG_ID_DONE:
      return {
        ...state,
        incompleteDocs: {
          selectedConf: state.incompleteDocs.selectedConf,
          configArray: state.incompleteDocs.configArray,
          loading: state.incompleteDocs.loading,
          result: action.payload
        }
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
    on(CastgroupActions.doAzione1, (state, action) => ({ ...state, ...action})),
    on(CastgroupActions.doAzione2, (state, action) => ({ ...state, ...action }))
  )(castState, castAction);
}
 */
