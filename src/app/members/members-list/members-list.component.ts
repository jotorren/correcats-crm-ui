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

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  private defaultDisplayedColumns: string[] = ['cognoms', 'nom', 'nick', 'email', 'dataAlta'];
  private mobileDisplayedColumns: string[] = ['cognoms', 'nom', 'nick'];

  searchControl = new FormControl();
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  private pan = new Subject<string>();
  private subscription2: Subscription;

  private myPageSize = Config.ui.members.list.pageSize;
  data: PaginatedDataSource<AssociadaListItem, MemberQuery>;
  // data = new PaginatedDataSource<AssociadaListItem, MemberQuery>(
  //   (request, query) => this.api.getMembers(request, query),
  //   {property: 'cognoms', order: 'asc'},
  //   {search: ''},
  //   this.myPageSize
  // );

  @ViewChild('search') search: MatInput;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sortField = 'cognoms';
  sortDirection = 'asc';

  constructor(private api: MemberService,
              private log: LogService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.myPageSize = Config.ui.members.list.mobilePageSize;
    }

    let filter = '';
    const saved = sessionStorage.getItem('MembersListComponent.search');
    if (saved) {
      this.log.debug('Restoring datasource filter value ' + saved);
      filter = saved;
    }

    this.data = new PaginatedDataSource<AssociadaListItem, MemberQuery>(
      (request, query) => this.api.getMembers(request, query),
      { property: this.sortField as keyof AssociadaListItem, order: this.sortDirection as SortOrder },
      { search: filter },
      this.myPageSize
    );

    this.subscription = this.modelChanged
      .pipe(
        debounceTime(Config.ui.members.list.debounceTime),
      )
      .subscribe((data) => {
        this.query(data);
      });

    this.subscription2 = this.pan
      .pipe(
        debounceTime(Config.ui.debounceTime)
      )
      .subscribe(action => {
        if (action === 'previous') {
          if (this.paginator.hasPreviousPage()) {
            this.paginator.previousPage();
          }
        } else {
          if (this.paginator.hasNextPage()) {
            this.paginator.nextPage();
          }
        }
      });
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

    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  get displayedColumns(): string[] {
    if (this.mobileQuery.matches) {
      return this.mobileDisplayedColumns;
    } else {
      return this.defaultDisplayedColumns;
    }
  }

  query(value) {
    this.data.queryBy(value);
  }

  inputChanged(value) {
    this.modelChanged.next(value);
  }

  onPanLeft(event) {
    this.pan.next('next');
  }

  onPanRight(event) {
    this.pan.next('previous');
  }
}
