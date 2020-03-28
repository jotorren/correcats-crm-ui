import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Config } from '../config/config';
import { Observable, of } from 'rxjs';

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

    constructor(private httpClient: HttpClient) { }

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
        return !!this.getToken();
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
            catchError(this.handleError({})));
    }

    logout() {
        this.removeTokens();
    }

    private handleError<T>(result?: T) {
        this.removeTokens();
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
