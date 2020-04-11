import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AssociadaListItem } from '../associada.list.item';
import { MemberService } from '../member.service';
import { Page, PageRequest } from 'src/app/shared/domain/datasource-page';
import { Config, SearchCriteria } from 'src/app/shared';

export class MembersDataSource implements DataSource<AssociadaListItem> {

    public fields: string[];
    public pageable: PageRequest<AssociadaListItem>;
    public criteria: SearchCriteria[];
    private doSearch = new Subject<number>();

    private emptyPage: Page<AssociadaListItem> = { content: [], number: 0, size: Config.ui.members.list.pageSize, totalElements: 0 };
    private pageSubject = new BehaviorSubject<Page<AssociadaListItem>>(this.emptyPage);
    public page$ = this.pageSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private service: MemberService) {
        this.doSearch.pipe(

        ).subscribe((code) => {
            if (code > 0) {
                this.loadingSubject.next(true);
                this.service.search(this.fields, this.pageable, this.criteria)
                    .pipe(
                        catchError(() => of(this.emptyPage)),
                        finalize(() => this.loadingSubject.next(false))
                    )
                    .subscribe(members => {
                        this.pageSubject.next(members);
                    });
            } else {
                this.pageSubject.next(this.emptyPage);
            }
        });
    }

    loadData(fields: string[], pageable: PageRequest<AssociadaListItem>, criteria: SearchCriteria[]) {
        this.fields = fields;
        this.pageable = pageable;
        this.criteria = criteria;
        this.doSearch.next(1);
    }

    fetch(page: number): void {
        this.pageable.page = page;
        this.doSearch.next(1);
    }

    reset(): void {
        this.fields = null;
        this.pageable = null;
        this.criteria = null;
        this.doSearch.next(0);
    }

    connect(collectionViewer: CollectionViewer): Observable<AssociadaListItem[]> {
        return this.pageSubject.pipe(
            map(page  => page.content)
        );
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.pageSubject.complete();
        this.loadingSubject.complete();
    }

}

