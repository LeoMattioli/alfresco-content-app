import {
  MatSidenavModule,
  MatListModule,
  MatIconModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PageLayoutModule } from '@alfresco/aca-shared';
import {
  DocumentListModule,
  BreadcrumbModule,
  UploadModule
} from '@alfresco/adf-content-services';
import {
  DataTableModule,
  ToolbarModule,
  SidenavLayoutModule,
  TRANSLATION_PROVIDER,
  DataColumnModule,
  PaginationModule
} from '@alfresco/adf-core';

import { AppHeaderModule } from '../components/header/header.module';
import { AppSidenavModule } from '../components/sidenav/sidenav.module';

import { castgroupReducer } from './store/castgroup.reducer';
import { CastgroupRoutingModule } from './castgroup-routing.module';
import { DocviewComponent } from './components/docview/docview.component';
import { AppToolbarModule } from '../components/toolbar/toolbar.module';
import { GridviewComponent } from './components/gridview/gridview.component';

import { IncompleteDocsEffects } from './store/incomplete-docs.effect';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('castgroupFeature', {
      castgroup: castgroupReducer
    }),
    EffectsModule.forFeature([IncompleteDocsEffects]),
    CastgroupRoutingModule,
    PageLayoutModule,
    DocumentListModule,
    DataColumnModule,
    DataTableModule,
    BreadcrumbModule,
    ToolbarModule,
    UploadModule,
    SidenavLayoutModule,
    AppHeaderModule,
    AppSidenavModule,
    AppToolbarModule,
    PaginationModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  declarations: [DocviewComponent, GridviewComponent],
  providers: [
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'cast',
        source: 'assets/castgroup'
      }
    }
  ]
})
export class CastgroupModule {}
