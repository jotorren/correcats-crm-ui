import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizatorGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(private authService: AuthenticationService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkActivation(route.data || {});
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkActivation(route.data || {});
    }

    canLoad(route: Route): boolean {
        return this.checkActivation(route.data || {});
    }

    private checkActivation(data: any): boolean {
        if (data.roles) {
            console.log('that route requires ' + data.roles);
        }

        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
        }

        return true;
    }
}
