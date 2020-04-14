import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

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
  DataColumnModule
} from '@alfresco/adf-core';

import { AppHeaderModule } from '../components/header/header.module';
import { AppSidenavModule } from '../components/sidenav/sidenav.module';

import { castgroupReducer } from './store/castgroup.reducer';
import { CastgroupRoutingModule } from './castgroup-routing.module';
import { DocviewComponent } from './components/docview/docview.component';
import { AppToolbarModule } from '../components/toolbar/toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('castgroupFeature', {
      castgroup: castgroupReducer
    }),
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
    AppToolbarModule
  ],
  declarations: [DocviewComponent],
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
