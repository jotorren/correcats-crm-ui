import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Config } from './config/config';
import { Result } from './domain/result';

export interface Municipi {
  codi: string;
  nom: string;
}

export interface CodiPostal {
  internalId: string;
  valor: string;
  municipi: string;
}

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private emptyResult: Result = {code: 0, message: '', result: []};

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getCities(filter: string): Observable<Municipi[]> {
    return this.http.get<Result>(Config.api.catalog.url.base +
      Config.api.catalog.url.municipis + filter, httpOptions)
      .pipe(
        map(cities => cities.result),
        catchError(this.handleError<Municipi[]>('getCities', []))
      );
  }

  getCitiesWithPostalCode(cp: string): Observable<Municipi[]> {
    return this.http.get<Result>(Config.api.catalog.url.base +
      Config.api.catalog.url.municipisambCP + cp, httpOptions)
      .pipe(
        map(cities => cities.result),
        catchError(this.handleError<Municipi[]>('getCities', []))
      );
  }

  getPostalCodes(municipi: string): Observable<CodiPostal[]> {
    return this.http.get<Result>(Config.api.catalog.url.base +
      Config.api.catalog.url.postalCodes + municipi, httpOptions)
      .pipe(
        map(cps => cps.result),
        catchError(this.handleError<CodiPostal[]>('getPostalCodes', []))
      );
  }
}
