import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizatorGuard } from './shared/security/authorizator.guard';
import { LoginComponent } from './shared/security/login.component';
import { MemberDetailsResolve } from './members/member-details/member-details.resolve';
import { MembersListComponent } from './members/members-list/members-list.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberAddComponent } from './members/member-add/member-add.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login form'
    }
  },
  {
    path: 'members-list',
    component: MembersListComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'List of Members',
      roles: []
    }
  },
  {
    path: 'member-details/:id',
    component: MemberDetailsComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'Member Details',
      roles: []
    },
    resolve: {
      api: MemberDetailsResolve
    }
  },
  {
    path: 'member-edit/:id',
    component: MemberEditComponent,
    canActivate: [ AuthorizatorGuard ],
    data: {
      title: 'Edit Member',
      roles: []
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
      roles: []
    }
  },
  { path: '',
    redirectTo: '/members-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
