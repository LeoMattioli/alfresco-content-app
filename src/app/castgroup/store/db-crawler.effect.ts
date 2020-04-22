import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as DbCrawlerActions from './db-crawler.actions';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json'
//   })
// };

@Injectable()
export class DbCrawlerEffects {
  private baseURl = 'http://ubuntu:8345/config';
  constructor(private actions$: Actions, private httpClient: HttpClient) {}

  @Effect()
  loadConf = this.actions$.pipe(
    ofType(DbCrawlerActions.LOAD_CONF_START),
    switchMap(_ => {
      return this.httpClient
        .get(this.baseURl)
        .toPromise()
        .then(
          (res: any) => {
            console.log(`${res}`);
            return new DbCrawlerActions.LoadConfSuccess(res);
          },
          err => {
            console.log(`${err}`);
            return new DbCrawlerActions.LoadConfSuccess(err);
          }
        );
    })
  );

  @Effect()
  loadConfId = this.actions$.pipe(
    ofType(DbCrawlerActions.LOAD_CONF_ID_START),
    switchMap((idxConfig: DbCrawlerActions.LoadConfIdStart) => {
      return this.httpClient
        .get(this.baseURl + '/' + idxConfig.payload)
        .toPromise()
        .then(
          (res: any) => {
            console.log(`${res}`);
            return new DbCrawlerActions.LoadConfIdSuccess(res);
          },
          err => {
            console.log(`${err}`);
            return new DbCrawlerActions.LoadConfIdSuccess(err);
          }
        );
    })
  );

  @Effect({ dispatch: false })
  gino$ = this.actions$.pipe(
    switchMap(action => {
      console.log(action);
      return of();
    })
  );
}
