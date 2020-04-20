import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AssociadaInfantil } from '../associada.infantil';
import { Config, AuthenticationService, Result } from 'src/app/shared';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../member.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { LogService } from 'src/app/shared/log/log.service';
import { handle } from 'src/app/shared/error/error-handlers';
import { MemberChildEditComponent } from '../member-child-edit/member-child-edit.component';

@Component({
  selector: 'app-member-child-details',
  templateUrl: './member-child-details.component.html',
  styleUrls: ['./member-child-details.component.scss']
})
export class MemberChildDetailsComponent implements OnInit {

  editMode = false;

  member: AssociadaInfantil;
  memberInmutable: AssociadaInfantil;
  isLoadingResults = false;
  durationInSeconds = 2;
  roles = Config.security.roles;

  constructor(
    public authService: AuthenticationService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private api: MemberService,
    private alerter: AlertService,
    private location: Location,
    private log: LogService, ) { }

  ngOnInit(): void {
    this.route.data.forEach((data: { api: Result }) => {
      this.member = data.api.result;
      this.memberInmutable = { ...this.member };
    });
  }

  onClickBack() {
    this.location.back();
  }

  onClickEdit(event) {
    this.editMode = true;
  }

  onClickEditField(field) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '450px';
    dialogConfig.data = { form: this.member, name: field };

    const dialogRef = this.dialog.open(MemberChildEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        for (const mbf of Object.keys(dialogResult)) {
          if (mbf === 'dataAlta' || mbf === 'dataBaixa') {
            if (dialogResult[mbf] && dialogResult[mbf].isValid()){
              this.member[mbf] = dialogResult[mbf];
            } else {
              this.member[mbf] = null;
            }
          } else {
            this.member[mbf] = dialogResult[mbf];
          }
        }
      }
    });
  }

  onClickEditCancel(event) {
    this.member = { ...this.memberInmutable };
    this.editMode = false;
  }

  onClickEditSave($event) {
    this.isLoadingResults = true;

    const memberId = this.member.id;
    delete this.member.id;
    this.api.updateChildMember(memberId, this.member)
      .subscribe((resok: any) => {
        this.member = resok.result;
        this.memberInmutable = { ...this.member };
        this.editMode = false;
        this.isLoadingResults = false;
      }, (resko: any) => {
        handle(resko, this.durationInSeconds, this.alerter);
        this.member = { ...this.memberInmutable };
        this.editMode = false;
        this.isLoadingResults = false;
      }
      );
  }
}
