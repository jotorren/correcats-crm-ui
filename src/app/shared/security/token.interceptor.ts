import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Config } from '../../shared/config/config';
import { AuthenticationService } from '../../shared/security/authentication.service';
import { LogService } from '../log/log.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthenticationService,
    private log: LogService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.log.debug('intercepted ' + request.url);
    if (this.authService.isLoggedIn()) {
      this.log.debug('logged-in > adding token to request');
      request = this.addToken(request, this.authService.getToken());
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(request, next);
      } else {
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    const headervalue = Config.security.token.header.prefix + token;
    return request.clone({
      setHeaders: {
        Authorization: headervalue
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      this.log.debug('token refresh for ' + request.url);
      return this.authService.refresh().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.access_token);
          return next.handle(this.addToken(request, res.access_token));
        }),
        catchError(error => {
          this.log.error(error.message);
          if (error.status !== 403) {
            this.log.error('unable to refresh ' + request.url + ' > redirecting to login' );
            this.authService.logout();
          }
          return throwError(error);
        })
      );

    } else {
      return this.refreshTokenSubject.pipe(
        filter(accessToken => accessToken != null),
        take(1),
        switchMap(accessToken => {
          return next.handle(this.addToken(request, accessToken));
        }));
    }
  }
}
