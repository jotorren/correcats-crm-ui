import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { LogService } from '../log/log.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthorizatorGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private log: LogService,
        private dialogRef: MatDialog) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.checkActivation(route);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.checkActivation(route);
    }

    canLoad(route: Route): boolean | Observable<boolean> {
        return this.checkActivation(route);
    }

    private checkActivation(route: Route | ActivatedRouteSnapshot): boolean | Observable<boolean> {
        this.log.debug('checkActivation for ' + route);
        if (route.data.roles && route.data.roles.length > 0) {
            this.log.debug('that route requires ' + route.data.roles);
        }

        if (!this.authService.isLoggedIn()) {
            this.log.debug('not logged-in > redirect to login');
            this.dialogRef.closeAll();
            this.router.navigate(['/login']);
        } else {
            this.log.debug('logged-in > checking expiration');
            return this.authService.checkToken();
        }

        return true;
    }
}
