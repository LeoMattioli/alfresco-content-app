import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DbCrawlerState } from '../../store/db-crawler.reducer';
import * as DbCrawlerActions from '../../store/db-crawler.actions';

@Component({
  selector: 'aca-dbcrawler',
  templateUrl: './dbcrawler.component.html',
  styleUrls: ['./dbcrawler.component.scss']
})
export class DbcrawlerComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  loading = false;
  configTable: any[] = null;

  constructor(private castStore: Store<DbCrawlerState>) {}

  ngOnInit() {
    this.castStore.dispatch(new DbCrawlerActions.LoadConfStart());

    this.castStore
      .select('castgroupFeature')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(state => {
        this.loading = state.dbCrawler.loading;
        this.configTable = state.dbCrawler.tables;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
