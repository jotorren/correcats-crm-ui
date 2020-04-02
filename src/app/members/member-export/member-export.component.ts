import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatListOption } from '@angular/material/list';

@Component({
  selector: 'app-member-export',
  templateUrl: './member-export.component.html',
  styleUrls: ['./member-export.component.scss']
})
export class MemberExportComponent implements OnInit {

  isLoadingResults = false;
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

  selectedFields: string[] = [];

  @ViewChild('allSelected') private allSelected: MatListOption;

  constructor(
  ) { }

  ngOnInit(): void {
    // Default selection
    this.selectedFields = ['nom', 'cognoms', 'nick', 'email', 'iban'];
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.selectedFields = this.availableFields.concat('all');
    } else {
      this.selectedFields = [];
    }
  }

}
