import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppConfigService, UserPreferencesService } from '@alfresco/adf-core';

import { DbCrawlerState } from '../../store/db-crawler.reducer';
import * as DbCrawlerActions from '../../store/db-crawler.actions';
import {
  DbCrawlerConfig,
  DbCrawlerObject
} from '../../shared/db-crawler-model';
import { NumberFormatterComponent } from '../../shared/number-formatter.component';
import { NumericEditorComponent } from '../../shared/numeric-editor.component';
import { RangeFilterComponent } from '../../shared/range-filter.component';

@Component({
  selector: 'aca-dbcrawler',
  templateUrl: './dbcrawler.component.html',
  styleUrls: ['./dbcrawler.component.scss'],
  host: { class: 'app-layout' } //altrimenti non usa la max-height
})
export class DbcrawlerComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  loading = false;
  configTable: DbCrawlerConfig[] = null;
  configSelected: DbCrawlerObject[] = null;
  configSelectedIdx = -1;

  minimizeSidenav = false;
  hideSidenav = false;
  expandedSidenav: boolean;

  configForm: FormGroup;

  /* datagrid variables start */
  frameworkComponents = {
    numberFormatterComponent: NumberFormatterComponent,
    numericEditorComponent: NumericEditorComponent,
    rangeFilterComponent: RangeFilterComponent
  };
  /** l'API di accesso alla griglia, serve, ad esempio, per l'esportazione CSV */
  private gridApi;

  /** opzioni comuni a tutte le colonne */
  defaultColDef = {
    sortable: true,
    filter: true,
    editable: true
  };
  /** definizione delle colonne */
  columnDefs = [
    {
      headerName: 'Label',
      field: 'label',
      rowDrag: true,
      rowDragText: this.rowDragFunction,
      cellEditor: 'agLargeTextCellEditor',
      minWidth: 350
    },
    {
      headerName: 'Nome Campo',
      field: 'dbfield'
    },
    {
      headerName: 'Tipo campo',
      field: 'type',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        cellHeight: 50,
        values: ['Varchar', 'Number', 'Date', 'Memo']
      }
    },
    {
      headerName: 'Constraint',
      field: 'constraint'
    },
    {
      headerName: 'Default',
      field: 'defaultvalue'
    },
    {
      headerName: 'Ordinamento',
      field: 'order',
      cellRenderer: 'numberFormatterComponent',
      cellEditor: 'numericEditorComponent',
      filter: 'rangeFilterComponent',
      hide: true
    }
  ];
  /** nel caso il multi sort per colonna sia attivo */
  multiSortkey = 'ctrl';

  // enables undo / redo
  undoRedoCellEditing: true;

  // restricts the number of undo / redo steps to 5
  undoRedoCellEditingLimit: 5;

  // enables flashing to help see cell changes
  enableCellChangeFlash: true;
  /** i dati da visualizzare */
  rowData = [];
  /* datagrid variables end */

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
        this.configSelectedIdx = -1;
      });

    if (!this.minimizeSidenav) {
      this.expandedSidenav = this.getSidenavState();
    } else {
      this.expandedSidenav = false;
    }

    this.configForm = new FormGroup({
      nomeConfig: new FormControl('', Validators.required)
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  rowDragFunction(params) {
    return params.defaultTextValue + ' (spostamento in corso)';
  }

  onGridExportCsv() {
    this.gridApi.exportDataAsCsv();
  }

  onCellValueChanged(params) {
    console.log(`provo a salvare la riga: ${JSON.stringify(params.data)}`);
  }

  onSaveConfig() {
    const pippo = [];
    for (let i = 0; i < this.gridApi.getModel().getRowCount(); i++) {
      this.gridApi.getModel().getRow(i).data.order = (i + 1) * 10;
      pippo.push(this.gridApi.getModel().getRow(i).data);
    }

    const gino = {
      id: -1,
      nome: this.configForm.value.nomeConfig,
      config: pippo
    };
    if (this.configSelectedIdx > -1) {
      gino.id = this.configTable[this.configSelectedIdx].id;
    }

    this.castStore.dispatch(new DbCrawlerActions.SaveConfStart(gino));
  }

  onSubmit() {
    console.log('Mandami');
  }

  onAddRow() {
    this.gridApi.updateRowData({
      add: [
        {
          label: '',
          dbfield: '',
          type: 'Varchar',
          constraint: '',
          defaultvalue: '',
          order: 999
        }
      ]
    });
  }

  openConfig(idx: number) {
    if (this.configTable[idx].config) {
      this.configSelected = <DbCrawlerObject[]>this.configTable[idx].config;
      this.configSelectedIdx = idx;
    } else {
      console.log(`Configurazione errata o mancante, id = ${idx}`);
      return;
    }
    this.rowData = this.configSelected;
    this.configForm.patchValue({ nomeConfig: this.configTable[idx].nome });
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
