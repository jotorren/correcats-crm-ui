import { Component, OnInit } from '@angular/core';
import { MemberErrorStateMatcher } from 'src/app/shared/error.state.matcher';
import { Config, AuthenticationService } from 'src/app/shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppGlobalService } from 'src/app/app.global.service';
import { Router } from '@angular/router';
import { MemberService } from '../member.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { LogService } from 'src/app/shared/log/log.service';
import { handle } from 'src/app/shared/error/error-handlers';
import { MemberValidatorService } from '../member-validator.service';

@Component({
  selector: 'app-member-child-add',
  templateUrl: './member-child-add.component.html',
  styleUrls: ['./member-child-add.component.scss']
})
export class MemberChildAddComponent implements OnInit {

  isLoadingResults = false;
  matcher = new MemberErrorStateMatcher();
  roles = Config.security.roles;

  childForm: FormGroup;
  durationInSeconds = 2;

  constructor(
    public authService: AuthenticationService,
    private app: AppGlobalService,
    private router: Router,
    private api: MemberService,
    private formBuilder: FormBuilder,
    private alerter: AlertService,
    private validators: MemberValidatorService,
    private log: LogService) {
      this.app.setTitle('Alta d\' un nou associat infantil');
    }

  ngOnInit(): void {
    this.childForm = this.formBuilder.group({
      nom: [null, Validators.required],
      cognoms: [null, Validators.required],
      sexe: ['D'],
      nick: [null, {
        validators: Validators.required,
        asyncValidators: this.validators.childNickValidator,
        updateOn: 'blur'
      }],
      responsable: [null, {
        validators: Validators.required,
        asyncValidators: this.validators.childResponsableValidator,
        updateOn: 'blur'
      }],
      dataNaixement: [null],
      email: [null, Validators.email],
      dni: [null, Validators.pattern],
      observacions: [null],
    }, { updateOn: 'change' });
  }

  onClickReset(event) {
    this.childForm.reset();
    this.childForm.get('sexe').setValue('D');
  }

  onFormSubmit() {
    this.isLoadingResults = true;

    const formData = {...this.childForm.value};
    this.api.addChildMember(formData)
      .subscribe((resok: any) => {
        this.isLoadingResults = false;
        this.router.navigate(['/member-child-details', resok.result]);
      }, (resko: any) => {
        handle(resko, this.durationInSeconds, this.alerter);
        this.isLoadingResults = false;
      });
  }
}
