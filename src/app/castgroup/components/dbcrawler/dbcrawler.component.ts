import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  AppConfigService,
  UserPreferencesService,
  ObjectDataTableAdapter
} from '@alfresco/adf-core';

import { DbCrawlerState } from '../../store/db-crawler.reducer';
import * as DbCrawlerActions from '../../store/db-crawler.actions';
import {
  DbCrawlerConfig,
  DbCrawlerObject
} from '../../shared/db-crawler-model';

@Component({
  selector: 'aca-dbcrawler',
  templateUrl: './dbcrawler.component.html',
  styleUrls: ['./dbcrawler.component.scss'],
  host: { class: 'app-layout' } //altrimenti non usa la max-height
})
export class DbcrawlerComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  loading = false;
  configTable: DbCrawlerConfig = null;
  configSelected: DbCrawlerObject[] = null;

  minimizeSidenav = false;
  hideSidenav = false;
  expandedSidenav: boolean;

  schema = [];
  data: ObjectDataTableAdapter = null;

  constructor(
    private castStore: Store<DbCrawlerState>,
    private router: Router,
    private appConfigService: AppConfigService,
    private userPreferenceService: UserPreferencesService
  ) {}

  ngOnInit() {
    this.castStore.dispatch(new DbCrawlerActions.LoadConfStart());

    this.castStore
      .select('castgroupFeature')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(state => {
        this.loading = state.dbCrawler.loading;
        this.configTable = state.dbCrawler.config;
        this.configSelected = null;
      });

    if (!this.minimizeSidenav) {
      this.expandedSidenav = this.getSidenavState();
    } else {
      this.expandedSidenav = false;
    }
  }

  openConfig(idx: number) {
    if (this.configTable[idx].config) {
      this.configSelected = JSON.parse(this.configTable[idx].config);
    } else {
      console.log(`Configurazione errata o mancante, id = ${idx}`);
      return;
    }
    console.log(`aprimi la configurazione: ${idx} ${this.configSelected}`);
    this.schema = [];
    this.schema.push({
      type: 'text',
      key: 'label',
      title: 'label',
      editable: true
    });
    this.schema.push({
      type: 'text',
      key: 'dbfield',
      title: 'dbfield',
      editable: true
    });
    this.schema.push({
      type: 'text',
      key: 'type',
      title: 'type',
      editable: true
    });
    this.schema.push({
      type: 'text',
      key: 'constraint',
      title: 'constraint',
      editable: true
    });
    this.schema.push({
      type: 'text',
      key: 'defaultvalue',
      title: 'defaultvalue',
      editable: true
    });
    this.schema.push({ type: 'text', key: 'order', title: 'order' });

    this.data = new ObjectDataTableAdapter(this.configSelected, this.schema);

    //    this.castStore.dispatch(new DbCrawlerActions.LoadConfIdStart(idx));
  }

  onRowClick(event: any) {
    console.log(`cliccato id: ${event.value.obj.dbfield}`);
  }

  exitView() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  onExpanded(state: boolean) {
    if (
      !this.minimizeSidenav &&
      this.appConfigService.get('sideNav.preserveState')
    ) {
      this.userPreferenceService.set('expandedSidenav', state);
    }
  }

  private getSidenavState(): boolean {
    const expand = this.appConfigService.get<boolean>(
      'sideNav.expandedSidenav',
      true
    );
    const preserveState = this.appConfigService.get<boolean>(
      'sideNav.preserveState',
      true
    );

    if (preserveState) {
      return (
        this.userPreferenceService.get('expandedSidenav', expand.toString()) ===
        'true'
      );
    }

    return expand;
  }
}
