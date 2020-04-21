import * as DbCrawlerActions from './db-crawler.actions';

export interface DbCrawlerState {
  tables: string[];
  loading: boolean;
}

export const initialState: DbCrawlerState = {
  tables: null,
  loading: false
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
        loading: true
      };
    case DbCrawlerActions.LOAD_CONF_SUCCESS:
      return {
        ...state,
        tables: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
