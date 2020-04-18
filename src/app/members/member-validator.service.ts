import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Config, Result } from '../shared';
import { LogService } from '../shared/log/log.service';

type AsyncValidator = (value: string, instance: MemberValidatorService) => Observable<Result>;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'any'
})
export class MemberValidatorService {

  constructor(
    private http: HttpClient,
    private log: LogService) { }

  get nickValidator() {
    return this.itemValidator(this.isNickOk);
  }

  get emailValidator() {
    return this.itemValidator(this.isEmailOk);
  }

  isNickOk(nick: string, instance: MemberValidatorService): Observable<Result> {
    const url = Config.api.members.url.base + Config.api.members.url.nick + nick;
    return instance.http.get<Result>(url, httpOptions).pipe(
      tap(_ => instance.log.debug(`verified nick=${nick}`))
    );
  }

  isEmailOk(email: string, instance: MemberValidatorService): Observable<Result> {
    const url = Config.api.members.url.base + Config.api.members.url.email + email;
    return instance.http.get<Result>(url, httpOptions).pipe(
      tap(_ => instance.log.debug(`verified emal=${email}`))
    );
  }

  private itemValidator(validatorMethod: AsyncValidator) {
    return (control: FormControl): Observable<{ [key: string]: any } | null> => {
      this.log.debug('control[' + control.value + '] pristine: ' + control.pristine);
      if (control.pristine) {
        return of(null);
      }

      return validatorMethod(control.value, this)
        .pipe(
          map(res => {
            if (res.result) {
              return null;
            } else {
              return { api: res.result };
            }
          }),
          catchError(this.handleError())
        );
    };
  }

  private handleError() {
    return (err: any): Observable<{ [key: string]: any } | null> => {

      let message = '';

      if (err.error && err.error.errors) {
        const httpCode = err.status;
        const apiErrors = err.error.errors;
        switch (httpCode) {
          case 404:
            this.log.error('Nick no trobat a Joomla');
            message = apiErrors[0].message;
            break;
          case 412:
            this.log.error('Nick/eMail en ús');
            message = apiErrors[0].message;
            break;
          case 500:
            this.log.error('Error intern del sistema');
            message = apiErrors[0].message;
            break;
          default:
            message = 'Error intern del sistema';
            this.log.error(err.message);
            console.log(err);
        }
      } else {
        message = 'Error intern del sistema';
        this.log.error(err.message);
        console.log(err);
      }

      // Let the app keep running by returning an empty result.
      return of({ api: message });
    };
  }
}
