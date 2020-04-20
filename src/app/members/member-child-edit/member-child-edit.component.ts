import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberErrorStateMatcher } from 'src/app/shared/error.state.matcher';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemberEditComponent } from '../member-edit/member-edit.component';
import { MemberService } from '../member.service';
import { MemberValidatorService } from '../member-validator.service';
import { LogService } from 'src/app/shared/log/log.service';

@Component({
  selector: 'app-member-child-edit',
  templateUrl: './member-child-edit.component.html',
  styleUrls: ['./member-child-edit.component.scss']
})
export class MemberChildEditComponent implements OnInit {
  isLoadingResults = false;

  memberForm: FormGroup;
  matcher = new MemberErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<MemberEditComponent>,
    @Inject(MAT_DIALOG_DATA) public model: any,
    private api: MemberService,
    private formBuilder: FormBuilder,
    private validators: MemberValidatorService,
    private log: LogService) { }

  ngOnInit(): void {
    this.memberForm = this.formBuilder.group({
      nom: [{ value: this.model.form.nom, disabled: this.model.name !== 'nom' }, Validators.required],
      cognoms: [{ value: this.model.form.cognoms, disabled: this.model.name !== 'nom' }, Validators.required],
      sexe: [{ value: this.model.form.sexe, disabled: this.model.name !== 'sexe' }],
      nick: [{value: this.model.form.nick, disabled: this.model.name !== 'nick'}, Validators.required, this.validators.childNickValidator],
      responsable: [{ value: this.model.form.responsable, disabled: this.model.name !== 'responsable'},
        Validators.required, this.validators.childResponsableValidator],
      email: [{ value: this.model.form.email, disabled: this.model.name !== 'email' }, Validators.email],
      dni: [{ value: this.model.form.nif, disabled: this.model.name !== 'dni' }, Validators.pattern],
      dataNaixement: [{
        value: this.model.form.dataNaixement ? new Date(this.model.form.dataNaixement) : null,
        disabled: this.model.name !== 'dataNaixement'
      }],
      dataAlta: [{
        value: this.model.form.dataAlta ? new Date(this.model.form.dataAlta) : null,
        disabled: this.model.name !== 'dataAlta'
      }],
      dataBaixa: [{
        value: this.model.form.dataBaixa ? new Date(this.model.form.dataBaixa) : null,
        disabled: this.model.name !== 'dataBaixa'
      }],
      observacions: [{ value: this.model.form.observacions, disabled: this.model.name !== 'observacions' }],
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
