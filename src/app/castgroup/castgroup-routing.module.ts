import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocviewComponent } from './components/docview/docview.component';
import { GridviewComponent } from './components/gridview/gridview.component';
import { DbcrawlerComponent } from './components/dbcrawler/dbcrawler.component';

const routes: Routes = [
  {
    path: 'cast',
    component: DocviewComponent,
    data: {
      title: 'CAST.DOCVIEW.TITOLO',
      defaultNodeId: '-my-',
      children: [
        {
          path: 'view/:nodeId',
          outlet: 'viewer',
          children: [
            {
              path: '',
              data: {
                navigateSource: 'cast'
              },
              loadChildren: '../components/viewer/viewer.module#AppViewerModule'
            }
          ]
        }
      ]
    }
  },
  {
    path: 'cast/:folderId',
    component: DocviewComponent,
    children: [
      {
        path: '',
        component: DocviewComponent,
        data: {
          title: 'CAST.DOCVIEW.TITOLO'
        }
      },
      {
        path: 'view/:nodeId',
        outlet: 'viewer',
        children: [
          {
            path: '',
            data: {
              navigateSource: 'cast'
            },
            loadChildren: '../components/viewer/viewer.module#AppViewerModule'
          }
        ]
      }
    ]
  },
  {
    path: 'castgrid',
    component: GridviewComponent,
    data: {
      title: 'CAST.GRIDVIEW.TITOLO',
      defaultNodeId: '-my-'
    },
    children: [
      {
        path: 'view/:nodeId',
        outlet: 'viewer',
        children: [
          {
            path: '',
            data: {
              navigateSource: 'castgrid'
            },
            loadChildren: '../components/viewer/viewer.module#AppViewerModule'
          }
        ]
      }
    ]
  },
  {
    path: 'dbcrawler',
    component: DbcrawlerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CastgroupRoutingModule {}
