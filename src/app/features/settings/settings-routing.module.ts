import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CrumbTypeEnum} from '@common/layout/breadcrumbs/breadcrumbs.component';

const settingsBreadcrumb = {
  name: 'shell.settings.title',
  url: 'settings',
  type: CrumbTypeEnum.Feature,
  translate: true
};

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./settings.component').then(m => m.SettingsComponent),
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {path: 'profile',
        loadComponent: () => import('./containers/admin/profile-name/profile-name.component').then(m => m.ProfileNameComponent),
        data: {
        staticBreadcrumb:[[settingsBreadcrumb, {
            name: 'shell.settings.profile',
            translate: true,
            type: CrumbTypeEnum.SubFeature
          }]]},
      },
      {
        path: 'webapp-configuration',
        loadComponent: () => import('~/features/settings/containers/webapp-configuration/webapp-configuration.component').then(m => m.WebappConfigurationComponent),
        data: {workspaceNeutral: true, staticBreadcrumb:[[settingsBreadcrumb, {
            name: 'shell.settings.configuration',
            translate: true,
            type: CrumbTypeEnum.SubFeature
          }]]},
      },
      {
        path: 'workspace-configuration',
        loadComponent: () => import('@common/settings/workspace-configuration/workspace-configuration.component').then(m => m.WorkspaceConfigurationComponent),
        data: {workspaceNeutral: true, staticBreadcrumb:[[settingsBreadcrumb, {
            name: 'shell.settings.workspace',
            translate: true,
            type: CrumbTypeEnum.SubFeature
          }]]},
      },
      {
        path: 'storage-credentials',
        loadComponent: () => import('@common/settings/storage-credentials/storage-credentials.component').then(m => m.StorageCredentialsComponent),
        data: {
          workspaceNeutral: true,
          route: '/settings/storage-credentials',
          staticBreadcrumb: [[settingsBreadcrumb, {
            name: 'shell.settings.storageCleanup',
            translate: true,
            type: CrumbTypeEnum.SubFeature
          }]]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
