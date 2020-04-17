import { Component, OnInit, Inject } from '@angular/core';
import { MemberService } from '../member.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberErrorStateMatcher } from '../../shared/error.state.matcher';
import { LogService } from 'src/app/shared/log/log.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Associada } from '../associada';
import { MemberValidatorService } from '../member-validator.service';

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
      activat: [null],
      sexe: [null],
      nom: [null, Validators.required],
      cognoms: [null, Validators.required],
      nick: [null, Validators.required, this.validators.nickValidator],
      email: [null, [
        Validators.required,
        Validators.email
      ], this.validators.emailValidator],
      nif: [null, Validators.pattern],
      iban: [null, Validators.pattern],

      telefon: [null],
      adreca: [null],
      codiPostal: [null],
      poblacio: [null],
      quotaAlta: [null, Validators.pattern],
      dataAlta: [null],
      dataBaixa: [null],
      observacions: [null, Validators.maxLength],
    }, { updateOn: 'change' });

    this.memberForm.get('activat').setValue(this.model.form.activat);
    this.memberForm.get('sexe').setValue(this.model.form.sexe);
    this.memberForm.get('nom').setValue(this.model.form.nom);
    this.memberForm.get('cognoms').setValue(this.model.form.cognoms);
    this.memberForm.get('nick').setValue(this.model.form.nick);
    this.memberForm.get('email').setValue(this.model.form.email);
    this.memberForm.get('nif').setValue(this.model.form.nif);
    this.memberForm.get('iban').setValue(this.model.form.iban);
    this.memberForm.get('telefon').setValue(this.model.form.telefon);
    this.memberForm.get('adreca').setValue(this.model.form.adreca);
    this.memberForm.get('codiPostal').setValue(this.model.form.codiPostal);
    this.memberForm.get('poblacio').setValue(this.model.form.poblacio);
    this.memberForm.get('quotaAlta').setValue(this.model.form.quotaAlta);
    this.memberForm.get('dataAlta').setValue(this.model.form.dataAlta);
    this.memberForm.get('dataBaixa').setValue(this.model.form.dataBaixa);
    this.memberForm.get('observacions').setValue(this.model.form.observacions);
  }

  onConfirm(): void {
    // this.isLoadingResults = true;
    // this.api.updateMember(this._id, this.memberForm.value)
    //   .subscribe((res: any) => {
    //     const id = res._id;
    //     this.isLoadingResults = false;
    //   }, (err: any) => {
    //     this.log.error(err);
    //     this.isLoadingResults = false;
    //   }
    // );

    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
