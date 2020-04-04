import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Config, Result, PageBean } from '../shared';
import { ServerSideEventsService } from '../shared/sse.service';
import { PageRequest, Page } from '../shared/domain/datasource-page';
import { AssociadaListItem } from './associada.list.item';


export interface MemberQuery {
  search: '';
}

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private emptyResult: Result = {code: 0, message: '', result: []};
  private emptyPage: Page<AssociadaListItem> = {content: [], number: 0, size: 0, totalElements: 0};

  constructor(private http: HttpClient, private sseService: ServerSideEventsService) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getMembers(request: PageRequest<AssociadaListItem>, query: MemberQuery): Observable<Page<AssociadaListItem>> {
    const offset = (request.page * request.size);

    let url = Config.api.members.base +
      Config.api.members.list.replace('{offset}', offset + '').replace('{limit}', request.size + '');

    if (query.search) {
        url = url + '&search=' + query.search;
    }

    return this.http.get<Result>(url, httpOptions)
      .pipe(
        map(members => {
          const pageBean: PageBean<AssociadaListItem> = members.result;
          return {
            content: pageBean.included,
            number: request.page,
            size: request.size,
            totalElements: pageBean.total
          };
        }),
        catchError(this.handleError<Page<AssociadaListItem>>('getMembers', this.emptyPage))
      );
  }

  getMemberById(id: string): Observable<Result> {
    const url = Config.api.members.base + Config.api.members.item.replace('{id}', id);
    return this.http.get<Result>(url, httpOptions).pipe(
      tap(_ => console.log(`fetched member id=${id}`)),
      catchError(this.handleError<Result>(`getMemberById id=${id}`, this.emptyResult))
    );
  }

  updateMember(id: string, form: any): Observable<Result> {
    const url = Config.api.members.base + Config.api.members.item.replace('{id}', id);
    return this.http.put<Result>(url, form, httpOptions);
  }

  unregisterMember(id: string): Observable<Result> {
    const url = Config.api.members.base + Config.api.members.unregister.replace('{id}', id);
    return this.http.put<Result>(url, httpOptions);
  }

  registerMember(id: string): Observable<Result> {
    const url = Config.api.members.base + Config.api.members.register.replace('{id}', id);
    return this.http.put<Result>(url, httpOptions);
  }

  verifyMember(nick: string, email: string): Observable<Result> {
    const url = Config.api.members.base +
      Config.api.members.verify.replace('{nick}', nick).replace('{email}', email);
    return this.http.get<Result>(url, httpOptions);
  }

  addMember(form: any): Observable<Result> {
    const url = Config.api.members.base + Config.api.members.create;
    return this.http.post<Result>(url, form, httpOptions);
  }

  export(fields: string[], sortBy: string): Observable<Result> {
    const url = Config.api.members.base +
      Config.api.members.export.replace('{fields}', fields.join(',')).replace('{sortBy}', sortBy);
    return this.http.get<Result>(url, httpOptions);
  }

  isReady(file: string): Observable<Result> {
    const url = Config.api.members.base + Config.api.members.ready + file;
    return this.http.get<Result>(url, httpOptions);
  }

  live(): Observable<string> {
    const url = Config.api.members.base + Config.api.members.live;
    return new Observable<string>(observer => {
        this.sseService.getServerSentEvent(url).subscribe(
            response => {
                observer.next(response.data);
            },
            error => {
                observer.error(error);
            },
            () => {
                observer.complete();
            }
        );
    });
  }

  download(file: string): void {
    const url = Config.api.members.base + Config.api.members.download + file;

    const myOptions = {
      responseType: 'blob' as 'json'
    };

    this.http.get(url, myOptions).subscribe(
      (response: any) => {
          const dataType = response.type;
          const binaryData = [];
          binaryData.push(response);
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          downloadLink.setAttribute('download', Config.api.members.downloadFileName);
          document.body.appendChild(downloadLink);
          downloadLink.click();
      }
    );
  }
}
