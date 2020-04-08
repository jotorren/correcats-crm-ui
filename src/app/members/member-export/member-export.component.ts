import { Component, OnInit, ViewChild } from '@angular/core';
import { MatListOption } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { handle } from '../../shared/error/error-handlers';
import { AlertService } from '../../shared/alert/alert.service';
import { Config } from '../../shared';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-member-export',
  templateUrl: './member-export.component.html',
  styleUrls: ['./member-export.component.scss']
})
export class MemberExportComponent implements OnInit {

  smallScreen: boolean;

  isLoadingResults = false;
  durationInSeconds = 2;

  availableFields: string[] = [
    'nom',
    'email',
    'telefon',
    'cognoms',
    'nif',
    'poblacio',
    'nick',
    'adreca',
    'codiPostal',
    'iban'
  ];
  defaultOrderedFields: string[] = [
    'nom',
    'cognoms',
    'nick',
    'iban',
    'email',
    'nif',
    'adreca',
    'telefon',
    'poblacio',
    'codiPostal'
  ];

  selectedFields: string[] = [];
  orderedFields: string[] = [];

  @ViewChild('allSelected') private allSelected: MatListOption;

  filterFields = ['sexe', 'activat', 'dataAlta', 'dataBaixa'];
  filterOps = [];

  filterBy: string;
  filterOp: string;
  filterValue;
  nullFilterValue = false;

  criteria = [];

  requestedFiles: Array<string> = new Array<string>();
  downloadableFiles: Array<string> = new Array<string>();
  sub: Subscription;

  constructor(
    private api: MemberService,
    private alerter: AlertService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.smallScreen = result.matches;
    });

    // Default selection
    this.selectedFields = ['nom', 'cognoms', 'nick', 'iban'];
    this.orderedFields = ['nom', 'cognoms', 'nick', 'iban'];

    this.sub = this.api.live()
      .subscribe(
        data => {
          this.requestedFiles = this.requestedFiles.filter(item => item !== data);
          this.downloadableFiles.unshift(data);
        },
        err => {
          console.log(err);
          this.sub.unsubscribe();
        },
        () => {
          this.sub.unsubscribe();
        }
      );
  }

  get filter() {
    return JSON.stringify(this.criteria);
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.selectedFields = this.availableFields.concat('all');
    } else {
      this.selectedFields = [];
    }
  }

  onSelectOption(option) {
    if (option.selected) {
      if (option.value === 'all') {
        this.orderedFields = this.defaultOrderedFields;
      } else {
        this.orderedFields.push(option.value);
      }
    } else {
      if (option.value === 'all') {
        this.orderedFields = [];
      } else {
        this.orderedFields.splice(this.orderedFields.lastIndexOf(option.value), 1);
      }
    }
    this.orderedFields = this.orderedFields.slice();
  }

  onFilterBySelected(event) {
    if (!event.value) {
      this.filterOps = [];
      this.filterOp = null;
      this.filterValue = null;
    } else {
      this.filterOps = [];
      Config.api.members.query.fields[event.value].forEach(element => {
        this.filterOps.push(Config.api.members.query.operators[element]);
      });

      // Set default selection
      if (event.value === 'activat') {
        this.filterOp = Config.api.members.query.operators.equals.code;
        this.filterValue = 'true';
      } else if (event.value === 'sexe') {
        this.filterOp = Config.api.members.query.operators.equals.code;
        this.filterValue = 'D';
      } else if (event.value === 'dataAlta') {
        this.filterOp = Config.api.members.query.operators.gte.code;
        const currentYear = new Date().getFullYear();
        this.filterValue = new Date('01/01/' + currentYear);
      } else if (event.value === 'dataBaixa') {
        this.filterOp = Config.api.members.query.operators.lte.code;
        this.filterValue = new Date();
      }
    }
  }

  onFilterOpSelected(event) {
    if (event.value === Config.api.members.query.operators.isnull.code) {
      this.filterValue = null;
      this.nullFilterValue = true;
    } else {
      this.nullFilterValue = false;
    }
  }

  onClickFilterAdd(event) {
    if (this.nullFilterValue || this.filterValue) {

      if (this.criteria.filter(crit => {
        return (crit.key === this.filterBy &&
          crit.operation === this.filterOp &&
          crit.value === this.filterValue);
      }).length > 0) {
        return;
      }

      let literal1;
      for (const p in Config.api.members.query.operators) {
        if (Config.api.members.query.operators[p].code === this.filterOp) {
          literal1 = Config.api.members.query.operators[p].desc;
        }
      }

      let literal2;
      if (this.filterBy === 'dataAlta' || this.filterBy === 'dataBaixa') {
        literal2 = new Date(this.filterValue).toLocaleDateString('es-ES');
      } else if (this.filterBy === 'sexe' || this.filterBy === 'activat') {
        literal2 = Config.api.members.map[this.filterValue];
      } else {
        literal2 = this.filterValue;
      }

      this.criteria.push({
        key: this.filterBy,
        operation: this.filterOp,
        value: this.filterValue,

        // extra fields only for visualization purposes
        operationMap: literal1,
        valueMap: literal2,
      });
      this.criteria = this.criteria.slice();

      this.filterBy = null,
        this.filterOp = null;
      this.filterValue = null;
      this.nullFilterValue = false;
    }
  }

  onClickDeleteCriteria(condition) {
    this.criteria = this.criteria.filter(crit => {
      return (crit.key !== condition.key ||
        crit.operation !== condition.operation ||
        crit.value !== condition.value);
    });
  }

  onClickGenerate(event) {
    if (this.orderedFields.length === 0) {
      return;
    }

    this.isLoadingResults = true;

    let sortBy = '';
    if (this.orderedFields.lastIndexOf('cognoms') >= 0) {
      sortBy = 'cognoms';
    } else if (this.orderedFields.lastIndexOf('nick') >= 0) {
      sortBy = 'nick';
    }

    if (this.criteria.length === 0) {
      this.criteria = [{
        key: 'activat',
        operation: Config.api.members.query.operators.equals.code,
        value: 'true',
        operationMap: Config.api.members.query.operators.equals.desc,
        valueMap: 'Sí'
      }];
    }

    const search = [];
    this.criteria.forEach(crit => {
      if (crit.key === 'activat') {
        // string to boolean conversion
        search.push({
          key: crit.key,
          operation: crit.operation,
          value: (crit.value === 'true'),
        });
      } else if (crit.key === 'dataAlta' || crit.key === 'dataBaixa') {
        // date to string conversion
        if (crit.operation === Config.api.members.query.operators.isnull.code) {
          search.push({
            key: crit.key,
            operation: Config.api.members.query.operators.equals.code,
            value: null,
          });
        } else {
          search.push({
            key: crit.key,
            operation: crit.operation,
            value: crit.value.toLocaleDateString('es-ES'),
          });
        }
      } else {
        search.push({
          key: crit.key,
          operation: crit.operation,
          value: crit.value,
        });
      }
    });

    this.isLoadingResults = true;
    this.api.export(Config.api.members.query.type.search, this.orderedFields, search, null, sortBy, null)
      .subscribe((resok: any) => {
        if (resok.result) {
          this.requestedFiles.push(resok.result);
        }
        this.isLoadingResults = false;
      }, (resko: any) => {
        handle(resko, this.durationInSeconds, this.alerter);
        this.isLoadingResults = false;
      });
  }

  onClickRefreshFile(file) {
    this.isLoadingResults = true;
    this.api.isReady(file)
      .subscribe((resok: any) => {
        if (resok.result) {
          this.requestedFiles = this.requestedFiles.filter(item => item !== file);
          this.downloadableFiles.unshift(file);
        }
        this.isLoadingResults = false;
      }, (resko: any) => {
        handle(resko, this.durationInSeconds, this.alerter);
        this.isLoadingResults = false;
      });
  }

  onClickDownload(file) {
    this.api.download(file);
  }

  onClickDeleteDownload(file) {
    this.downloadableFiles = this.downloadableFiles.filter(item => item !== file);
  }
}
