import * as DbCrawlerActions from './db-crawler.actions';
import { DbCrawlerConfig, DbCrawlerObject } from '../shared/db-crawler-model';

export interface DbCrawlerState {
  config: DbCrawlerConfig[];
  loading: boolean;
  loadingConfig: boolean;
  configloaded: DbCrawlerObject;
}

export const initialState: DbCrawlerState = {
  config: null,
  loading: false,
  loadingConfig: false,
  configloaded: null
};

export function dbCrawlerReducer(
  state: DbCrawlerState,
  action: DbCrawlerActions.DbCrawlerActions
) {
  console.log(`Chiamato Reducer: ${action.type}`);
  switch (action.type) {
    case DbCrawlerActions.LOAD_CONF_START:
      return {
        ...state,
        loading: true,
        config: null,
        loadingConfig: false,
        configloaded: null
      };
    case DbCrawlerActions.LOAD_CONF_SUCCESS:
      return {
        ...state,
        config: action.payload,
        loading: false,
        loadingConfig: false,
        configloaded: null
      };
    case DbCrawlerActions.SAVE_CONF_START:
    case DbCrawlerActions.SAVE_CONF_SUCCESS:
    case DbCrawlerActions.SAVE_CONF_FAILURE:
      return state;
    default:
      return state;
  }
}
