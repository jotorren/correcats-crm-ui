import { Component, OnInit, OnDestroy } from '@angular/core';
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
  debounceTime = 500;

  data = new PaginatedDataSource<AssociadaListItem, MemberQuery>(
    (request, query) => this.api.getMembers(request, query),
    {property: 'cognoms', order: 'asc'},
    {search: ''},
    Config.ui.members.list.pageSize
  );

  constructor(private api: MemberService) { }

  ngOnInit(): void {
    this.subscription = this.modelChanged
      .pipe(
        debounceTime(this.debounceTime),
      )
      .subscribe((data) => {
        this.query(data);
      });
  }

  query(value) {
    this.data.queryBy(value);
  }

  inputChanged(value) {
    this.modelChanged.next(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
