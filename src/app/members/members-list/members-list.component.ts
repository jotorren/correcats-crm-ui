import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Config } from '../../shared';
import { PaginatedDataSource } from '../../shared/datasource-paginated';
import { MemberService, MemberQuery } from '../member.service';
import { AssociadaListItem } from '../associada.list.item';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['cognoms', 'nom', 'nick'];

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  private pan = new Subject<string>();
  private subscription2: Subscription;

  data = new PaginatedDataSource<AssociadaListItem, MemberQuery>(
    (request, query) => this.api.getMembers(request, query),
    {property: 'cognoms', order: 'asc'},
    {search: ''},
    Config.ui.members.list.pageSize
  );

  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private api: MemberService) { }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
