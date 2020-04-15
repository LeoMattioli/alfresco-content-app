import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Directionality } from '@angular/cdk/bidi';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
  MinimalNodeEntity,
  PathElement,
  MinimalNodeEntryEntity,
  PathElementEntity
} from '@alfresco/js-api';
import { NodePermissionService, ContentApiService } from '@alfresco/aca-shared';
import {
  AppStore,
  getCurrentFolder,
  getAppSelection,
  isAdmin
} from '@alfresco/aca-shared/store';
import {
  SidenavLayoutComponent,
  UserPreferencesService,
  AppConfigService,
  UploadService,
  FileUploadEvent
} from '@alfresco/adf-core';
import {
  DocumentListComponent,
  ShareDataRow
} from '@alfresco/adf-content-services';
import { ContentActionRef } from '@alfresco/adf-extensions';

import { AppExtensionService } from '../../../extensions/extension.service';

import { CastgroupState } from '../../store/castgroup.reducer';
import { NodeActionsService } from '../../../services/node-actions.service';
import {
  ReloadDocumentListAction,
  SetSelectedNodesAction,
  SetCurrentFolderAction,
  ViewNodeExtras,
  ViewNodeAction
} from '../../../../../projects/aca-shared/store/src/public_api';
import { ContentManagementService } from '../../../services/content-management.service';

class ConfigColumn {
  constructor(
    public key: string,
    public type?: string,
    public title?: string,
    public sortable?: boolean,
    public cssClass?: string
  ) {
    this.type = type || 'text';
    this.title = title || '';
    this.sortable = sortable || true;
    this.cssClass = cssClass || null;
  }
}

@Component({
  selector: 'aca-docview',
  templateUrl: './docview.component.html',
  styleUrls: ['./docview.component.scss'],
  host: { class: 'app-layout' }
})
export class DocviewComponent implements OnInit, OnDestroy {
  @ViewChild('layout')
  layout: SidenavLayoutComponent;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  onDestroy$: Subject<boolean> = new Subject<boolean>();

  isValidPath = true;
  isSmallScreen = false;
  isAdmin = false;
  selectedNode: MinimalNodeEntity;
  node: MinimalNodeEntryEntity;

  private nodePath: PathElement[];
  protected subscriptions: Subscription[] = [];

  expandedSidenav: boolean;
  currentFolderId = '-my-';
  canUpload = false;

  minimizeSidenav = false;
  hideSidenav = false;
  direction: Directionality;

  private minimizeConditions: string[] = ['search'];
  private hideConditions: string[] = ['/preview/'];

  toolbarActions: ContentActionRef[] = [];

  displayType: string;
  includeFields: string[] = ['path', 'properties'];

  title: string;
  configSelected = 0;
  configColumns: ConfigColumn[][] = [
    [
      new ConfigColumn('$thumbnail', 'image'),
      new ConfigColumn(
        'name',
        'text',
        'Name',
        true,
        'full-width ellipsis-cell'
      ),
      new ConfigColumn('createdByUser.displayName', 'text', 'Creato Da'),
      new ConfigColumn(
        'properties.exif:pixelXDimension',
        'text',
        'Dimensioni X'
      )
    ],
    [
      new ConfigColumn('$thumbnail', 'image'),
      new ConfigColumn(
        'name',
        'text',
        'Name',
        true,
        'full-width ellipsis-cell'
      ),
      new ConfigColumn('createdByUser.displayName', 'text', 'Creatura di'),
      new ConfigColumn(
        'properties.exif:pixelXDimension',
        'text',
        'Dimensioni X'
      ),
      new ConfigColumn(
        'properties.exif:pixelYDimension',
        'text',
        'Dimensioni Y'
      )
    ]
  ];

  constructor(
    protected store: Store<AppStore>,
    private permission: NodePermissionService,
    private router: Router,
    private userPreferenceService: UserPreferencesService,
    private appConfigService: AppConfigService,
    private breakpointObserver: BreakpointObserver,
    private extensions: AppExtensionService,
    private route: ActivatedRoute,
    private contentApi: ContentApiService,
    private content: ContentManagementService,
    private nodeActionsService: NodeActionsService,
    private uploadService: UploadService,
    private castStore: Store<CastgroupState>
  ) {}

  ngOnInit() {
    const { route, nodeActionsService, uploadService } = this;
    const { data } = route.snapshot;

    this.title = data.title;

    route.params.subscribe(({ folderId }: Params) => {
      const nodeId = folderId || data.defaultNodeId;

      this.contentApi.getNode(nodeId).subscribe(
        node => {
          this.isValidPath = true;

          if (node.entry && node.entry.isFolder) {
            this.updateCurrentNode(node.entry);
          } else {
            this.router.navigate(['/docview', node.entry.parentId], {
              replaceUrl: true
            });
          }
        },
        () => (this.isValidPath = false)
      );
    });

    this.subscriptions = this.subscriptions.concat([
      nodeActionsService.contentCopied.subscribe(nodes =>
        this.onContentCopied(nodes)
      ),
      uploadService.fileUploadComplete
        .pipe(debounceTime(300))
        .subscribe(file => this.onFileUploadedEvent(file)),
      uploadService.fileUploadDeleted
        .pipe(debounceTime(300))
        .subscribe(file => this.onFileUploadedEvent(file)),

      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(result => {
          this.isSmallScreen = result.matches;
        })
    ]);

    this.store
      .select(isAdmin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.isAdmin = value;
      });

    this.hideSidenav = this.hideConditions.some(el =>
      this.router.routerState.snapshot.url.includes(el)
    );

    this.minimizeSidenav = this.minimizeConditions.some(el =>
      this.router.routerState.snapshot.url.includes(el)
    );

    if (!this.minimizeSidenav) {
      this.expandedSidenav = this.getSidenavState();
    } else {
      this.expandedSidenav = false;
    }

    this.store
      .select(getCurrentFolder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(node => {
        this.currentFolderId = node ? node.id : null;
        this.canUpload = node && this.permission.check(node, ['create']);
      });

    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(selection => {
        this.toolbarActions = this.extensions.getAllowedToolbarActions();
      });

    this.castStore
      .select('castgroupFeature')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(state => {
        this.displayType = state.castgroup.vista;
        this.configSelected = state.castgroup.vistaSelezionata;
        this.reload();
      });

    this.content.reset.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.documentList.resetSelection();
      this.store.dispatch(new SetSelectedNodesAction([]));
    });

    this.content.reload.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.documentList.resetSelection();
      this.store.dispatch(new SetSelectedNodesAction([]));
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];

    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  hideMenu(event: Event) {
    if (this.layout.container.isMobileScreenSize) {
      event.preventDefault();
      this.layout.container.toggleMenu();
    }
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

  private async updateCurrentNode(node: MinimalNodeEntryEntity) {
    this.nodePath = null;

    if (node && node.path && node.path.elements) {
      const elements = node.path.elements;

      this.nodePath = elements.map(pathElement => {
        return Object.assign({}, pathElement);
      });

      if (elements.length > 1) {
        if (elements[1].name === 'User Homes') {
          if (!this.isAdmin) {
            elements.splice(0, 2);
          }
        } else if (elements[1].name === 'Sites') {
          await this.normalizeSitePath(node);
        }
      }
    }

    this.node = node;
    this.store.dispatch(new SetCurrentFolderAction(node));
  }
  private async normalizeSitePath(node: MinimalNodeEntryEntity) {
    const elements = node.path.elements;

    // remove 'Sites'
    elements.splice(1, 1);

    if (this.isSiteContainer(node)) {
      // rename 'documentLibrary' entry to the target site display name
      // clicking on the breadcrumb entry loads the site content
      const parentNode = await this.contentApi
        .getNodeInfo(node.parentId)
        .toPromise();
      node.name = parentNode.properties['cm:title'] || parentNode.name;

      // remove the site entry
      elements.splice(1, 1);
    } else {
      // remove 'documentLibrary' in the middle of the path
      const docLib = elements.findIndex(el => el.name === 'documentLibrary');
      if (docLib > -1) {
        const siteFragment = elements[docLib - 1];
        const siteNode = await this.contentApi
          .getNodeInfo(siteFragment.id)
          .toPromise();

        // apply Site Name to the parent fragment
        siteFragment.name = siteNode.properties['cm:title'] || siteNode.name;
        elements.splice(docLib, 1);
      }
    }
  }

  isSiteContainer(node: MinimalNodeEntryEntity): boolean {
    if (node && node.aspectNames && node.aspectNames.length > 0) {
      return node.aspectNames.indexOf('st:siteContainer') >= 0;
    }
    return false;
  }

  isRootNode(nodeId: string): boolean {
    if (
      this.node &&
      this.node.path &&
      this.node.path.elements &&
      this.node.path.elements.length > 0
    ) {
      return this.node.path.elements[0].id === nodeId;
    }
    return false;
  }

  getParentNodeId(): string {
    return this.node ? this.node.id : null;
  }

  onContentCopied(nodes: MinimalNodeEntity[]) {
    const newNode = nodes.find(node => {
      return (
        node && node.entry && node.entry.parentId === this.getParentNodeId()
      );
    });
    if (newNode) {
      this.reload(this.selectedNode);
    }
  }

  reload(selectedNode?: MinimalNodeEntity): void {
    if (this.isOutletPreviewUrl()) {
      return;
    }

    this.store.dispatch(new ReloadDocumentListAction());
    if (selectedNode) {
      this.store.dispatch(new SetSelectedNodesAction([selectedNode]));
    }
  }

  private isOutletPreviewUrl(): boolean {
    return location.href.includes('viewer:view');
  }

  onFileUploadedEvent(event: FileUploadEvent) {
    const node: MinimalNodeEntity = event.file.data;

    // check root and child nodes
    if (node && node.entry && node.entry.parentId === this.getParentNodeId()) {
      this.reload(this.selectedNode);
      return;
    }

    // check the child nodes to show dropped folder
    if (event && event.file.options.parentId === this.getParentNodeId()) {
      this.displayFolderParent(event.file.options.path, 0);
      return;
    }

    if (event && event.file.options.parentId) {
      if (this.nodePath) {
        const correspondingNodePath = this.nodePath.find(
          pathItem => pathItem.id === event.file.options.parentId
        );

        // check if the current folder has the 'trigger-upload-folder' as one of its parents
        if (correspondingNodePath) {
          const correspondingIndex =
            this.nodePath.length - this.nodePath.indexOf(correspondingNodePath);
          this.displayFolderParent(event.file.options.path, correspondingIndex);
        }
      }
    }
  }

  displayFolderParent(filePath = '', index: number) {
    const parentName = filePath.split('/')[index];
    const currentFoldersDisplayed =
      <ShareDataRow[]>this.documentList.data.getRows() || [];

    const alreadyDisplayedParentFolder = currentFoldersDisplayed.find(
      row => row.node.entry.isFolder && row.node.entry.name === parentName
    );

    if (alreadyDisplayedParentFolder) {
      return;
    }
    this.reload(this.selectedNode);
  }

  onBreadcrumbNavigate(route: PathElementEntity) {
    if (this.nodePath && this.nodePath.length > 2) {
      if (
        this.nodePath[1].name === 'Sites' &&
        this.nodePath[2].id === route.id
      ) {
        return this.navigate(this.nodePath[3].id);
      }
    }
    this.navigate(route.id);
  }

  navigate(nodeId: string = null) {
    const location = this.router.url.match(/.*?(?=\/|$)/g)[1];

    const commands = [`/${location}`];

    if (nodeId && !this.isRootNode(nodeId)) {
      commands.push(nodeId);
    }

    this.router.navigate(commands);
  }

  navigateTo(node: MinimalNodeEntity) {
    if (node && node.entry) {
      this.selectedNode = node;
      const { id, isFolder } = node.entry;

      if (isFolder) {
        this.navigate(id);
        return;
      }

      this.showPreview(node, { location: this.router.url });
    }
  }

  showPreview(node: MinimalNodeEntity, extras?: ViewNodeExtras) {
    if (node && node.entry) {
      const id =
        (<any>node).entry.nodeId || (<any>node).entry.guid || node.entry.id;

      this.store.dispatch(new ViewNodeAction(id, extras));
    }
  }
}
