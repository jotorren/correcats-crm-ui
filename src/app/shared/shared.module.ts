import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert/alert.service';
import { ErrorListComponent } from './error/error.component';
import { ConfirmDialogComponent } from './dialog/confirm-dialog.component';
import { AuthenticationService } from './security/authentication.service';
import { AuthorizatorGuard } from './security/authorizator.guard';
import { TokenInterceptor } from './security/token.interceptor';
import { LoginComponent } from './security/login.component';
import { DefaultPipe } from './default.pipe';

// used to create fake backend
import { fakeBackendProvider } from './fake-backend';

const ANGULAR_MODULES: any[] = [FormsModule, ReactiveFormsModule];

@NgModule({
  imports: [
    CommonModule,
    ANGULAR_MODULES,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatIconModule
  ],
  exports: [
    CommonModule,
    ANGULAR_MODULES,
    DefaultPipe,
    AlertComponent,
    ErrorListComponent,
    ConfirmDialogComponent,
    LoginComponent
  ],
  declarations: [
    DefaultPipe,
    AlertComponent,
    ErrorListComponent,
    ConfirmDialogComponent,
    LoginComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AlertService,
    AuthenticationService,
    AuthorizatorGuard,

    // provider used to create fake backend
    // fakeBackendProvider
  ]
})
export class SharedModule {}
