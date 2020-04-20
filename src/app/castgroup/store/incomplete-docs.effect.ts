import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { SearchService, SearchConfigurationService } from '@alfresco/adf-core';
import { ResultSetPaging } from '@alfresco/js-api';

import * as CastgroupActions from './castgroup.actions';
import { CastgroupState } from './castgroup.reducer';

@Injectable()
export class IncompleteDocsEffects {
  constructor(
    private actions$: Actions,
    private searchService: SearchService,
    private searchConfSrv: SearchConfigurationService,
    private castStore: Store<CastgroupState>
  ) {
    console.log('Effect constructed');
  }

  @Effect()
  loadConfibById = this.actions$.pipe(
    ofType(CastgroupActions.LOAD_CONFIG_ID_START),
    switchMap((docConfig: CastgroupActions.LoadingIncompleteDocsConfigById) => {
      const queryBody = this.searchConfSrv.generateQueryBody('', 1000, 0);
      queryBody.query.query = docConfig.payload.config.query;
      queryBody.include = ['properties'];

      return this.searchService.searchByQueryBody(queryBody);
    }),
    withLatestFrom(this.castStore.select('castgroupFeature')),
    map(([res, state]) => {
      const documentsPojo: any = [];
      let docConfig = null;
      if (state.castgroup.incompleteDocs.configArray) {
        docConfig =
          state.castgroup.incompleteDocs.configArray[
            state.castgroup.incompleteDocs.selectedConf
          ];
        res.list.entries.forEach(el => {
          const tmpEntry = {
            filename: el.entry.name,
            id: el.entry.id
          };
          docConfig.formFields.forEach(form => {
            tmpEntry[form.key] = el.entry.properties[form.key];
          });

          documentsPojo.push(tmpEntry);
        });
        return new CastgroupActions.LoadIncompleteDocsConfigById(documentsPojo);
      }
      return of();
    })
  );

  @Effect()
  incompleteLoad = this.actions$.pipe(
    ofType(CastgroupActions.LOADING_INCOMPLETE_CONFIG),
    switchMap(_ => {
      const gino = this.searchConfSrv.generateQueryBody('', 1000, 0);
      gino.query.query = 'TYPE:"demo:TFldRules"';
      gino.include = ['properties'];
      gino.fields = ['demo:config'];
      console.log('Effettivamente sono un effetto');
      return this.searchService.searchByQueryBody(gino).pipe(
        map((nodi: ResultSetPaging) => {
          const configArray = [];
          nodi.list.entries.forEach(el => {
            configArray.push(JSON.parse(el.entry.properties['demo:config']));
          });
          return new CastgroupActions.LoadIncompleteDocsConfig(configArray);
        }),
        catchError(error => {
          console.log(`Effect Error: ${error}`);
          return of();
        })
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
