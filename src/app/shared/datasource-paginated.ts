import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, startWith, pluck, share, tap } from 'rxjs/operators';
import { indicate } from './datasource-operators';
import { Page, Sort, PaginatedEndpoint } from './domain/datasource-page';

export interface SimpleDataSource<T> extends DataSource<T> {
  connect(): Observable<T[]>;
  disconnect(): void;
}

export class PaginatedDataSource<T, Q> implements SimpleDataSource<T> {
  private pageNumber = new Subject<number>();
  private sort = new Subject<Sort<T>>();
  private query: BehaviorSubject<Q>;
  private loading = new Subject<boolean>();

  public loading$ = this.loading.asObservable();
  public page$: Observable<Page<T>>;

  constructor(
    private endpoint: PaginatedEndpoint<T, Q>,
    initialSort: Sort<T>,
    initialQuery: Q,
    initialPage: number,
    public pageSize = 20) {
      this.query = new BehaviorSubject<Q>(initialQuery);
      const param$ = combineLatest([
        this.query,
        this.sort.pipe(startWith(initialSort))
      ]);
      this.page$ = param$.pipe(
        switchMap(([query, sort]) => this.pageNumber.pipe(
          startWith(initialPage),
          switchMap(page => this.endpoint({page, sort, size: this.pageSize}, query)
            .pipe(indicate(this.loading))
          )
        )),
        share()
      );
  }

  sortBy(sort: Sort<T>): void {
    this.sort.next(sort);
  }

  queryBy(query: Partial<Q>): void {
    const lastQuery = this.query.getValue();
    const nextQuery = {...lastQuery, ...query};
    this.query.next(nextQuery);
    this.pageNumber.next(0);
  }

  fetch(page: number): void {
    this.pageNumber.next(page);
  }

  connect(): Observable<T[]> {
    return this.page$.pipe(pluck('content'));
  }

  disconnect(): void {}
}
