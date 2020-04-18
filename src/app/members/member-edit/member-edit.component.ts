import { Component, OnInit, Inject } from '@angular/core';
import { MemberService } from '../member.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberErrorStateMatcher } from '../../shared/error.state.matcher';
import { LogService } from 'src/app/shared/log/log.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Associada } from '../associada';
import { MemberValidatorService } from '../member-validator.service';
import * as moment from 'moment';

interface EditModel {
  form: Associada;
  name: keyof Associada;
}

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  isLoadingResults = false;

  memberForm: FormGroup;
  matcher = new MemberErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<MemberEditComponent>,
    @Inject(MAT_DIALOG_DATA) public model: EditModel,
    private api: MemberService,
    private formBuilder: FormBuilder,
    private validators: MemberValidatorService,
    private log: LogService) { }

  ngOnInit(): void {
    this.memberForm = this.formBuilder.group({
      sexe: [{value: this.model.form.sexe, disabled: this.model.name !== 'sexe'}],
      infantil: [{value: this.model.form.infantil, disabled: this.model.name !== 'sexe'}],
      nom: [{value: this.model.form.nom, disabled: this.model.name !== 'nom'}, Validators.required],
      cognoms: [{value: this.model.form.cognoms, disabled: this.model.name !== 'nom'}, Validators.required],
      nick: [{value: this.model.form.nick, disabled: this.model.name !== 'nick'}, Validators.required, this.validators.nickValidator],
      email: [{value: this.model.form.email, disabled: this.model.name !== 'email'}, [
        Validators.required,
        Validators.email
      ], this.validators.emailValidator],
      nif: [{value: this.model.form.nif, disabled: this.model.name !== 'nif'}, Validators.pattern],
      iban: [{value: this.model.form.iban, disabled: this.model.name !== 'iban'}, [Validators.pattern]],

      telefon: [{value: this.model.form.telefon, disabled: this.model.name !== 'telefon'}],
      adreca: [{value: this.model.form.adreca, disabled: this.model.name !== 'adreca'}],
      codiPostal: [{value: this.model.form.codiPostal, disabled: this.model.name !== 'codiPostal'}],
      poblacio: [{value: this.model.form.poblacio, disabled: this.model.name !== 'poblacio'}],
      quotaAlta: [{value: this.model.form.quotaAlta, disabled: this.model.name !== 'quotaAlta'}, Validators.pattern],
      dataAlta: [{value: moment(this.model.form.dataAlta, 'DD/MM/YYYY'), disabled: this.model.name !== 'dataAlta'}],
      dataBaixa: [{value: moment(this.model.form.dataBaixa, 'DD/MM/YYYY'), disabled: this.model.name !== 'dataBaixa'}],
      observacions: [{value: this.model.form.observacions, disabled: this.model.name !== 'observacions'}],
    }, { updateOn: 'change' });
  }

  onConfirm(): void {
    // Close the dialog, return form
    this.dialogRef.close(this.memberForm.value);
  }

  onDismiss(): void {
    // Close the dialog, return null
    this.dialogRef.close(null);
  }

}
