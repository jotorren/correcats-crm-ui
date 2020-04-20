import { ChangeDetectorRef, Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Config } from '../../shared';
import { PaginatedDataSource } from '../../shared/datasource-paginated';
import { MemberService, MemberQuery } from '../member.service';
import { AssociadaListItem } from '../associada.list.item';
import { LogService } from 'src/app/shared/log/log.service';
import { MatInput } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { SortOrder } from 'src/app/shared/domain/datasource-page';
import { AppGlobalService } from 'src/app/app.global.service';

@Component({
  selector: 'app-member-children-list',
  templateUrl: './member-children-list.component.html',
  styleUrls: ['./member-children-list.component.scss']
})
export class MembersListComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  private defaultDisplayedColumns: string[] = ['infantil', 'cognoms', 'nom', 'nick', 'responsable', 'dataNaixement', 'activat'];
  private mobileDisplayedColumns: string[] = ['infantil', 'cognoms', 'nom'];

  searchControl = new FormControl();
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  // private pan = new Subject<string>();
  // private subscription2: Subscription;

  private myPageSize = Config.ui.members.list.pageSize;
  data: PaginatedDataSource<AssociadaListItem, MemberQuery>;
  // data = new PaginatedDataSource<AssociadaListem, MemberQuery>(
  //   (request, query) => this.api.getMembers(request, query),
  //   {property: 'cognoms', order: 'asc'},
  //   {search: ''},
  //   this.myPageSize
  // );
  wdeleted = false;

  @ViewChild('search') search: MatInput;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sortField = 'cognoms';
  sortDirection = 'asc';

  constructor(
    private app: AppGlobalService,
    private api: MemberService,
    private log: LogService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.app.setTitle('Llista de tots els associats infantils');
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.myPageSize = Config.ui.members.list.mobilePageSize;
    }

    let filter = '';
    let saved = sessionStorage.getItem('MembersListComponent.search');
    if (saved) {
      this.log.debug('Restoring datasource filter value ' + saved);
      filter = saved;
    }

    saved = sessionStorage.getItem('MembersListComponent.wdeleted');
    if (saved) {
      this.log.debug('Restoring [with deleted] value ' + saved);
      this.wdeleted = saved === 'true';
      filter = saved + ';' + filter;
      sessionStorage.removeItem('MembersListComponent.wdeleted');
    }

    let currentPage = 0;
    saved = sessionStorage.getItem('MembersListComponent.pageIndex');
    if (saved) {
      this.log.debug('Restoring [current page] value ' + saved);
      currentPage = parseInt(saved, 10);
      sessionStorage.removeItem('MembersListComponent.pageIndex');
    }

    this.data = new PaginatedDataSource<AssociadaListItem, MemberQuery>(
      (request, query) => this.api.getMembers(request, query),
      { property: this.sortField as keyof AssociadaListItem, order: this.sortDirection as SortOrder },
      { search: filter },
      currentPage,
      this.myPageSize
    );

    this.subscription = this.modelChanged
      .pipe(
        debounceTime(Config.ui.members.list.debounceTime),
      )
      .subscribe((data) => {
        this.query(data);
      });

    // this.subscription2 = this.pan
    //   .pipe(
    //     debounceTime(Config.ui.debounceTime)
    //   )
    //   .subscribe(action => {
    //     if (action === 'previous') {
    //       if (this.paginator.hasPreviousPage()) {
    //         this.paginator.previousPage();
    //       }
    //     } else {
    //       if (this.paginator.hasNextPage()) {
    //         this.paginator.nextPage();
    //       }
    //     }
    //   });
  }

  ngAfterViewInit(): void {
    const saved = sessionStorage.getItem('MembersListComponent.search');
    if (saved) {
      this.log.debug('Restoring input filter value ' + saved);
      this.searchControl.setValue(saved);
      sessionStorage.removeItem('MembersListComponent.search');
    }
  }

  ngOnDestroy(): void {
    if (this.searchControl.value) {
      sessionStorage.setItem('MembersListComponent.search', this.searchControl.value);
    }

    sessionStorage.setItem('MembersListComponent.wdeleted', '' + this.wdeleted);
    sessionStorage.setItem('MembersListComponent.pageIndex', '' + this.paginator.pageIndex);

    this.subscription.unsubscribe();
    // this.subscription2.unsubscribe();
  }

  get displayedColumns(): string[] {
    if (this.mobileQuery.matches) {
      return this.mobileDisplayedColumns;
    } else {
      return this.defaultDisplayedColumns;
    }
  }

  age(dataNaixement) {
    return dataNaixement ? new Date().getFullYear() - new Date(dataNaixement).getFullYear() : null;
  }

  query(value) {
    this.data.queryBy(value);
  }

  inputChanged(value) {
    value.search = this.wdeleted + ';' + value.search;
    this.modelChanged.next(value);
  }

  // onPanLeft(event) {
  //   this.pan.next('next');
  // }

  // onPanRight(event) {
  //   this.pan.next('previous');
  // }
}
