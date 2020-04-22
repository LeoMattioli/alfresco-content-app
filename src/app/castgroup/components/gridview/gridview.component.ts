import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import {
  AppConfigService,
  UserPreferencesService,
  ObjectDataTableAdapter
} from '@alfresco/adf-core';

import { CastgroupState } from '../../store/castgroup.reducer';
import * as CastgroupActions from '../../store/castgroup.actions';
import { DocumentsConfig } from '../../shared/incomplete-model';
import {
  AppStore,
  ViewNodeAction,
  ViewNodeExtras
} from '../../../../../projects/aca-shared/store/src/public_api';

@Component({
  selector: 'aca-gridview',
  templateUrl: './gridview.component.html',
  styleUrls: ['./gridview.component.scss'],
  host: { class: 'app-layout' } //altrimenti non usa la max-height
})
export class GridviewComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  loading = false;
  configArray: DocumentsConfig[] = null;

  minimizeSidenav = false;
  hideSidenav = false;
  expandedSidenav: boolean;

  data = null;
  schema = [];
  confSelezionata = -1;

  constructor(
    protected store: Store<AppStore>,
    private castStore: Store<CastgroupState>,
    private router: Router,
    private appConfigService: AppConfigService,
    private userPreferenceService: UserPreferencesService
  ) {}

  exitView() {
    this.router.navigate(['/']);
  }

  openView(idView: number) {
    console.log(`aprimi la view ${idView}`);
    if (this.configArray[idView]) {
      this.confSelezionata = idView;
      this.castStore.dispatch(
        new CastgroupActions.LoadingIncompleteDocsConfigById({
          idx: idView,
          config: this.configArray[idView]
        })
      );
    }
  }

  loadResults(confIdx: number, data: any[]) {
    this.schema = [];
    // Always add the filename at the beginning
    this.schema.push({
      type: 'text',
      key: 'filename',
      title: 'Name',
      sortable: 'true'
    });

    this.configArray[confIdx].formFields.forEach(el => {
      const tmpCol = {
        key: el.key,
        title: el.label,
        sortable: 'true'
      };
      if (el.type === 'date') {
        tmpCol['type'] = el.type;
        tmpCol['format'] = 'dd/MM/yyyy';
      } else {
        tmpCol['type'] = 'text';
      }

      this.schema.push(tmpCol);
    });

    this.data = new ObjectDataTableAdapter(data, this.schema);
  }

  onRowClick(event: any) {
    //this.router.navigate(['/my-second-view', this.idConfig, event.value.obj.id]);
    console.log(
      `cliccato id: ${event.value.obj.id}, location: ${this.router.url}`
    );

    this.store.dispatch(
      new ViewNodeAction(event.value.obj.id, <ViewNodeExtras>{
        location: this.router.url
      })
    );
  }

  ngOnInit() {
    this.castStore.dispatch(new CastgroupActions.LoadingIncompleteDocsConfig());

    this.castStore
      .select('castgroupFeature')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(state => {
        this.loading = state.castgroup.incompleteDocs.loading;
        this.configArray = state.castgroup.incompleteDocs.configArray;
        if (state.castgroup.incompleteDocs.result) {
          console.log(`Carica i results della ricerca`);
          this.loadResults(
            state.castgroup.incompleteDocs.selectedConf,
            state.castgroup.incompleteDocs.result
          );
        }
        console.log(`Qualcuno ci ha cambiato lo stato castgroupFeature`);
      });

    if (!this.minimizeSidenav) {
      this.expandedSidenav = this.getSidenavState();
    } else {
      this.expandedSidenav = false;
    }
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
