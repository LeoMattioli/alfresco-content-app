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
  constructor(private actions$: Actions, private httpClient: HttpClient) {}

  @Effect()
  loadConf = this.actions$.pipe(
    ofType(DbCrawlerActions.LOAD_CONF_START),
    switchMap(_ => {
      return this.httpClient
        .get('http://ubuntu:8345/')
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

  @Effect({ dispatch: false })
  gino$ = this.actions$.pipe(
    switchMap(action => {
      console.log(action);
      return of();
    })
  );
}
