import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatButton } from '@angular/material/button';
import { SearchCriteria, Config } from '../../shared';
import { SearchOperator } from '../../shared/domain/search-criteria';
import { MemberService } from '../member.service';
import { LogService } from 'src/app/shared/log/log.service';
import { MemberErrorStateMatcher } from 'src/app/shared/error.state.matcher';
import { AssociadaListItem } from '../associada.list.item';
import { PageRequest, SortOrder } from 'src/app/shared/domain/datasource-page';
import { MembersDataSource } from './member-find-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { AppGlobalService } from 'src/app/app.global.service';

@Component({
  selector: 'app-member-find',
  templateUrl: './member-find.component.html',
  styleUrls: ['./member-find.component.scss']
})
export class MemberFindComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  findForm: FormGroup;
  matcher = new MemberErrorStateMatcher();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchbutton') searchButton: MatButton;

  private defaultDisplayedColumns: string[] = ['cognoms', 'nom', 'nick', 'email', 'dataAlta', 'dataBaixa', 'activat', 'infantil'];
  private mobileDisplayedColumns: string[] = ['cognoms', 'nom', 'nick', 'activat'];

  data: MembersDataSource;
  private fields = ['id', 'nom', 'cognoms', 'nick', 'email', 'activat', 'infantil', 'dataAlta', 'dataBaixa', 'observacions'];
  sortable = false;
  sortDirection = 'asc';

  constructor(
    private app: AppGlobalService,
    private api: MemberService,
    private formBuilder: FormBuilder,
    private log: LogService,
    private el: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.app.setTitle('Localitza un associat');
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.findForm = this.formBuilder.group({
      wodeleted: [false],

      nom: [null],
      cognoms: [null],
      sexe: [''],
      nick: [null],
      infantil: [false],
      email: [null, Validators.email],
      nif: [null, Validators.pattern],
      codiPostal: [null],
      poblacio: [null],
      quotaAlta: [null, Validators.pattern]
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
      this.sortable = true;
      this.sortDirection = this.data.pageable.sort.order;
    }
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.doSearch());
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
        operation: Config.api.members.query.operators[Config.api.members.query.fields.activat.default].code,
        value: true
      });
    }

    if (this.findForm.value.sexe) {
      conds.push({
        key: 'sexe',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.sexe.default].code,
        value: this.findForm.value.sexe
      });
    }

    if (this.findForm.value.nom) {
      conds.push({
        key: 'nom',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.nom.default].code,
        value: this.findForm.value.nom
      });
    }

    if (this.findForm.value.cognoms) {
      conds.push({
        key: 'cognoms',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.cognoms.default].code,
        value: this.findForm.value.cognoms
      });
    }

    if (this.findForm.value.nick) {
      conds.push({
        key: 'nick',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.nick.default].code,
        value: this.findForm.value.nick
      });
    }

    if (this.findForm.value.email) {
      conds.push({
        key: 'email',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.email.default].code,
        value: this.findForm.value.email
      });
    }

    if (this.findForm.value.codiPostal) {
      conds.push({
        key: 'codiPostal',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.codiPostal.default].code,
        value: this.findForm.value.codiPostal
      });
    }

    if (this.findForm.value.poblacio) {
      conds.push({
        key: 'poblacio',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.poblacio.default].code,
        value: this.findForm.value.poblacio
      });
    }

    if (this.findForm.value.nif) {
      conds.push({
        key: 'nif',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.nif.default].code,
        value: this.findForm.value.nif
      });
    }

    if (this.findForm.value.quotaAlta) {
      conds.push({
        key: 'quotaAlta',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.quotaAlta.default].code,
        value: parseFloat(this.findForm.value.quotaAlta)
      });
    }

    if (!this.findForm.value.infantil) {
      conds.push({
        key: 'infantil',
        operation: Config.api.members.query.operators[Config.api.members.query.fields.infantil.default].code,
        value: false
      });
    }

    return conds;
  }

  onClickReset(event) {
    this.data.reset();
    this.findForm.reset();
    this.findForm.get('sexe').setValue('');
    this.sortable = false;
    this.searchButton.focus();
  }

  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('input.ng-invalid');
    if (invalidControl) {
      this.log.warn(invalidControl.labels[0].textContent + ': ' + invalidControl.validationMessage);
      invalidControl.focus();
    } else {
      this.doSearch();
    }
  }

  doSearch() {
    const sc = this.buildCriteria(this.findForm.value);
    this.log.debug('Looking for a member with ' + JSON.stringify(sc));

    const pr: PageRequest<AssociadaListItem> = {
      page: 0,
      size: this.mobileQuery.matches ? Config.ui.members.list.mobilePageSize : Config.ui.members.list.pageSize,
      sort: {
        property: this.sort.active as keyof AssociadaListItem,
        order: this.sort.direction as SortOrder
      }
    };

    this.data.loadData(this.fields, pr, sc);
    this.sortable = true;
  }

  private findInvalidControlsRecursive(formToInvestigate: FormGroup): string[] {
    const invalidControls: string[] = [];
    const recursiveFunc = (form: FormGroup) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) { invalidControls.push(field); }
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }
}
