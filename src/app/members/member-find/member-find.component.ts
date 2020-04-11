import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { SearchCriteria } from '../../shared';
import { MemberService } from '../member.service';
import { LogService } from 'src/app/shared/log/log.service';
import { MemberErrorStateMatcher } from 'src/app/shared/error.state.matcher';
import { AssociadaListItem } from '../associada.list.item';
import { PageRequest } from 'src/app/shared/domain/datasource-page';
import { MembersDataSource } from './member-find-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-member-find',
  templateUrl: './member-find.component.html',
  styleUrls: ['./member-find.component.scss']
})
export class MemberFindComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  findForm: FormGroup;
  matcher = new MemberErrorStateMatcher();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private defaultDisplayedColumns: string[] = ['cognoms', 'nom', 'nick', 'email', 'dataAlta', 'dataBaixa'];
  private mobileDisplayedColumns: string[] = ['cognoms', 'nom', 'nick'];

  data: MembersDataSource;
  private fields = ['id', 'nom', 'cognoms', 'nick', 'email', 'activat', 'dataAlta', 'dataBaixa'];

  constructor(
    private api: MemberService,
    private formBuilder: FormBuilder,
    private log: LogService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.findForm = this.formBuilder.group({
      wodeleted: [false],
      sexe: [''],
      nom: [null],
      cognoms: [null],
      nick: [null],
      email: [null, Validators.email],
      nif: [null, Validators.pattern],
      iban: [null, Validators.pattern],

      telefon: [null],
      adreca: [null],
      codiPostal: [null],
      poblacio: [null],
      quotaAlta: [null, Validators.pattern],
      dataAlta: [null],

      observacions: [null, Validators.maxLength],
    });

    this.data = new MembersDataSource(this.api);

    let saved = sessionStorage.getItem('MemberFindComponent.form');
    if (saved) {
      this.findForm.setValue(JSON.parse(saved));
      sessionStorage.removeItem('MemberFindComponent.form');
    }

    let currentPage;
    saved = sessionStorage.getItem('MemberFindComponent.page');
    if (saved) {
      currentPage = JSON.parse(saved);
      sessionStorage.removeItem('MemberFindComponent.page');
    }

    let currentCriteria;
    saved = sessionStorage.getItem('MemberFindComponent.criteria');
    if (saved) {
      currentCriteria = JSON.parse(saved);
      sessionStorage.removeItem('MemberFindComponent.criteria');
    }

    if (currentPage && currentCriteria) {
      this.log.debug('Restoring component state');
      this.data.loadData(this.fields, currentPage, currentCriteria);
    }
  }

  ngOnDestroy(): void {
    sessionStorage.setItem('MemberFindComponent.form', JSON.stringify(this.findForm.value));

    if (this.data.pageable) {
      sessionStorage.setItem('MemberFindComponent.page', JSON.stringify(this.data.pageable));
    } else {
      sessionStorage.removeItem('MemberFindComponent.page');
    }

    if (this.data.criteria) {
      sessionStorage.setItem('MemberFindComponent.criteria', JSON.stringify(this.data.criteria));
    } else {
      sessionStorage.removeItem('MemberFindComponent.criteria');
    }

  }

  get displayedColumns(): string[] {
    if (this.mobileQuery.matches) {
      return this.mobileDisplayedColumns;
    } else {
      return this.defaultDisplayedColumns;
    }
  }

  buildCriteria(form: any): SearchCriteria[] {
    const conds = [];

    if (!this.findForm.value.wodeleted) {
      conds.push({
        key: 'activat',
        operation: 'EQ',
        value: true
      });
    }

    if (this.findForm.value.sexe) {
      conds.push({
        key: 'sexe',
        operation: 'EQ',
        value: this.findForm.value.sexe
      });
    }

    if (this.findForm.value.nom) {
      conds.push({
        key: 'nom',
        operation: 'CONTAINS',
        value: this.findForm.value.nom
      });
    }

    if (this.findForm.value.cognoms) {
      conds.push({
        key: 'cognoms',
        operation: 'CONTAINS',
        value: this.findForm.value.cognoms
      });
    }

    if (this.findForm.value.nick) {
      conds.push({
        key: 'nick',
        operation: 'CONTAINS',
        value: this.findForm.value.nick
      });
    }

    if (this.findForm.value.email) {
      conds.push({
        key: 'email',
        operation: 'CONTAINS',
        value: this.findForm.value.email
      });
    }

    if (this.findForm.value.codiPostal) {
      conds.push({
        key: 'codiPostal',
        operation: 'EQ',
        value: this.findForm.value.codiPostal
      });
    }

    if (this.findForm.value.poblacio) {
      conds.push({
        key: 'poblacio',
        operation: 'CONTAINS',
        value: this.findForm.value.poblacio
      });
    }

    if (this.findForm.value.nif) {
      conds.push({
        key: 'nif',
        operation: 'EQ',
        value: this.findForm.value.nif
      });
    }

    if (this.findForm.value.quotaAlta) {
      conds.push({
        key: 'quotaAlta',
        operation: 'EQ',
        value: parseFloat(this.findForm.value.quotaAlta)
      });
    }

    return conds;
  }

  onFormSubmit() {
    // this.doSearch = true;
    const sc = this.buildCriteria(this.findForm.value);
    this.log.debug(JSON.stringify(sc));

    // export interface Sort<T> {
    //   property: keyof T;
    //   order: 'asc' | 'desc';
    // }

    this.log.debug(this.sort.active + ' ' + this.sort.direction);
    const pr: PageRequest<AssociadaListItem> = {
      page: 0,
      size: this.paginator.pageSize,
      // sort: {
      //   property: this.sort.active,
      //   order: this.sort.direction
      // }
    };

    this.data.loadData(this.fields, pr, sc);
  }

  onClickReset(event) {
    this.data.reset();
  }
}
