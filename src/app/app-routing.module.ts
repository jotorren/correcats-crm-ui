import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatorGuard } from './shared/security/authorizator.guard';
import { LoginComponent } from './shared/security/login.component';
import { MemberDetailsResolve } from './members/member-details/member-details.resolve';
import { MembersListComponent } from './members/member-children-list/member-children-list.component';
import { MemberChildAddComponent } from './members/member-child-add/member-child-add.component';
import { MemberChildDetailsComponent } from './members/member-child-details/member-child-details.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberAddComponent } from './members/member-add/member-add.component';
import { MemberReportComponent } from './members/member-report/member-report.component';
import { MemberExportComponent } from './members/member-export/member-export.component';
import { MemberFindComponent } from './members/member-find/member-find.component';
import { Config } from './shared';
import { MemberChildDetailsResolve } from './members/member-child-details/member-child-details.resolve';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login form'
    }
  },
  {
    path: 'member-children-list',
    component: MembersListComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'List of Members',
      roles: [
        Config.security.roles.ADMIN,
        Config.security.roles.SECRETARIA,
        Config.security.roles.JUNTA,
        Config.security.roles.ORGANITZADORA
      ]
    }
  },
  {
    path: 'member-child-add',
    component: MemberChildAddComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'Add New Child Member',
      roles: [
        Config.security.roles.ADMIN,
        Config.security.roles.SECRETARIA,
        Config.security.roles.JUNTA
      ]
    }
  },
  {
    path: 'member-child-details/:id',
    component: MemberChildDetailsComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'Member Child Details',
      roles: [
        Config.security.roles.ADMIN,
        Config.security.roles.SECRETARIA,
        Config.security.roles.JUNTA,
        Config.security.roles.ORGANITZADORA
      ]
    },
    resolve: {
      api: MemberChildDetailsResolve
    }
  },
  {
    path: 'member-details/:id',
    component: MemberDetailsComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'Member Details',
      roles: [
        Config.security.roles.ADMIN,
        Config.security.roles.SECRETARIA,
        Config.security.roles.JUNTA,
        Config.security.roles.ORGANITZADORA
      ]
    },
    resolve: {
      api: MemberDetailsResolve
    }
  },
  {
    path: 'member-add',
    component: MemberAddComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'Add New Member',
      roles: [
        Config.security.roles.ADMIN,
        Config.security.roles.SECRETARIA,
        Config.security.roles.JUNTA
      ]
    }
  },
  {
    path: 'members-report',
    component: MemberReportComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'Default export data to CSV',
      roles: [
        Config.security.roles.ADMIN,
        Config.security.roles.SECRETARIA,
        Config.security.roles.JUNTA
      ]
    }
  },
  {
    path: 'members-export',
    component: MemberExportComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'Custom export data to CSV',
      roles: [
        Config.security.roles.ADMIN,
        Config.security.roles.SECRETARIA,
        Config.security.roles.JUNTA
      ]
    }
  },
  {
    path: 'member-find',
    component: MemberFindComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'Look for a member',
      roles: [
        Config.security.roles.ADMIN,
        Config.security.roles.SECRETARIA,
        Config.security.roles.JUNTA
      ]
    }
  },
  { path: '',
    redirectTo: '/member-find',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
