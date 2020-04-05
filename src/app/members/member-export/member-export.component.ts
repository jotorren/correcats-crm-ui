import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatListOption } from '@angular/material/list';
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

  requestedFiles: Array<string> = new Array<string>();
  downloadableFiles: Array<string> = new Array<string>();
  sub: Subscription;

  constructor(
    private api: MemberService,
    private alerter: AlertService,
  ) { }

  ngOnInit(): void {
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

    this.api.export(Config.api.members.query.type.search, this.orderedFields,
      [{
          key: 'activat',
          operation: Config.api.members.query.operators.equals,
          value: true
      }], null, sortBy, null)
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
}
