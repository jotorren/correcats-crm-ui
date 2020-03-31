import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Config, Result } from '../shared';

type AsyncValidator = (value: string, instance: MemberValidatorService) => Observable<Result>;

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'any'
})
export class MemberValidatorService {

  constructor(private http: HttpClient) { }

  get nickValidator() {
    return this.itemValidator(this.isNickOk);
  }

  get emailValidator() {
    return this.itemValidator(this.isEmailOk);
  }

  isNickOk(nick: string, instance: MemberValidatorService): Observable<Result> {
    const url = Config.api.members.base + Config.api.members.nick + nick;
    return instance.http.get<Result>(url, httpOptions).pipe(
      tap(_ => console.log(`verified nick=${nick}`))
    );
  }

  isEmailOk(email: string, instance: MemberValidatorService): Observable<Result> {
    const url = Config.api.members.base + Config.api.members.email + email;
    return instance.http.get<Result>(url, httpOptions).pipe(
      tap(_ => console.log(`verified emal=${email}`))
    );
  }

  private itemValidator(validatorMethod: AsyncValidator) {
    return (control: FormControl): Observable<{[key: string]: any} | null> => {
      return validatorMethod(control.value, this)
        .pipe(
          map(res => {
            if (res.result) {
              return null;
            } else {
              return {api: res.result};
            }
          }),
          catchError(this.handleError())
        );
    };
  }

  private handleError() {
    return (err: any): Observable<{[key: string]: any} | null> => {

      const httpCode = err.status;
      const apiErrors = err.error.errors;

      let message = '';
      switch (httpCode) {
        case 404:
          console.log('Nick no trobat a Joomla');
          message = apiErrors[0].message;
          break;
        case 412:
          console.log('Nick/eMail en ús');
          message = apiErrors[0].message;
          break;
        case 500:
          console.log('Error intern del sistema');
          message = apiErrors[0].message;
          break;
        default:
          message = err.message;
      }

      // Let the app keep running by returning an empty result.
      return of({api: message});
    };
  }
}
