import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocviewComponent } from './components/docview/docview.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CastgroupRoutingModule {}
