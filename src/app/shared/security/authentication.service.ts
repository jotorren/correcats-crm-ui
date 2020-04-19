import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Config } from '../config/config';
import { Result } from '../domain/result';
import { JwtHelper } from '../security/jwt-helper';


interface ServerResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
}

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
};

@Injectable({
providedIn: 'root'
})
export class AuthenticationService {
    private config = Config.security.token;
    private jwtHelper: JwtHelper = new JwtHelper();

    constructor(private httpClient: HttpClient, private router: Router) { }

    login(username: string, password: string) {

        let data = `client_id=${this.config.oidc.clientId}&client_secret=${this.config.oidc.clientCredentials}`;
        data = data + `&username=${username}&password=${password}&grant_type=${this.config.oidc.grantType}`;

        return this.httpClient.post<ServerResponse>(
            this.config.endpoint,
            data,
            httpOptions
        ).pipe(tap(res => {
            this.storeTokens(res);
        }));
    }

    isLoggedIn() {
        return (null != this.getToken());
    }

    getUserRoles() {
        const token = this.getToken();
        if (token) {
            const jwttoken = this.jwtHelper.decodeToken(token);
            return jwttoken.resource_access[this.config.oidc.clientId].roles;
        } else {
            return [];
        }
    }

    checkToken() {
        return this.httpClient.get<Result>(Config.security.token.check.endpoint, httpOptions).pipe(
            map(res => res.result),
            catchError(this.handleError<boolean>(false, false))
        );
    }

    getToken() {
        return this.config.storage.provider.getItem(this.config.storage.key);
    }

    getRefreshToken() {
        return this.config.storage.provider.getItem(this.config.storage.refreshKey);
    }

    refresh() {
        let data = `client_id=${this.config.oidc.clientId}&client_secret=${this.config.oidc.clientCredentials}`;
        data = data + `&refresh_token=${this.getRefreshToken()}&grant_type=${this.config.oidc.refreshGrantType}`;

        return this.httpClient.post<ServerResponse>(
            this.config.endpoint,
            data,
            httpOptions
        ).pipe(
            tap(res => { this.storeTokens(res); }),
            catchError(this.handleError(true, {})));
    }

    logout() {
        this.removeTokens();
        sessionStorage.clear(); // to remove previously saved components state
        this.router.navigate(['/login']);
    }

    hasAnyRole(roles: string[]): boolean {
        if (undefined === roles || null === roles || roles.length === 0) {
            return true;
        }

        const userRoles: string[] = this.getUserRoles();
        if (userRoles) {
            let found = false;
            for (let i = 0; i < roles.length && !found; i++) {
                found = userRoles.indexOf(roles[i]) > -1;
            }
            return found;
        }
        return false;
    }

    private handleError<T>(removeTokens: boolean, result?: T) {
        if (removeTokens) {
            this.removeTokens();
        }

        return (error: any): Observable<T> => {

            return of(result as T);
        };
    }

    private storeTokens(res: ServerResponse) {
        this.config.storage.provider.setItem(this.config.storage.key, res.access_token);
        this.config.storage.provider.setItem(this.config.storage.refreshKey, res.refresh_token);
    }

    private removeTokens() {
        this.config.storage.provider.removeItem(this.config.storage.key);
        this.config.storage.provider.removeItem(this.config.storage.refreshKey);
    }
}
