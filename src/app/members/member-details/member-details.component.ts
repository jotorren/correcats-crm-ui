import { Component, OnInit, ViewChild } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { debounceTime, tap, map, filter } from 'rxjs/operators';
import { MemberService } from '../member.service';
import { Associada } from '../associada';
import { Config, Result, ConfirmDialogModel, ConfirmDialogComponent } from '../../shared';
import { handle } from '../../shared/error/error-handlers';
import { AlertService } from '../../shared/alert/alert.service';
import { MemberEditComponent } from '../member-edit/member-edit.component';
import { LogService } from 'src/app/shared/log/log.service';
import * as moment from 'moment';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

  private pan = new Subject<string>();

  @ViewChild('usertabs') tabs: MatTabGroup;

  editMode = false;

  smallScreen: boolean;
  member: Associada;
  memberInmutable: Associada;
  isLoadingResults = false;

  durationInSeconds = 2;

  constructor(
    private route: ActivatedRoute,
    private api: MemberService,
    private router: Router,
    public dialog: MatDialog,
    private alerter: AlertService,
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    private log: LogService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.smallScreen = result.matches;
    });

    this.route.data.forEach((data: { api: Result }) => {
      this.member = data.api.result;
      this.memberInmutable = { ...this.member };
    });

    this.pan
      .pipe(
        debounceTime(Config.ui.debounceTime)
      )
      .subscribe(action => {
        if (action === 'previous') {
          if (this.tabs.selectedIndex > 0) {
            this.tabs.selectedIndex--;
          }
        } else {
          if (this.tabs.selectedIndex < (this.tabs._tabs.length - 1)) {
            this.tabs.selectedIndex++;
          }
        }
      });
  }

  onPanLeft(event) {
    this.pan.next('next');
  }

  onPanRight(event) {
    this.pan.next('previous');
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

    const dialogRef = this.dialog.open(MemberEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        for (const mbf of Object.keys(dialogResult)) {
          if ((mbf === 'dataAlta' || mbf === 'dataBaixa') && dialogResult[mbf]) {
            this.member[mbf] = moment(dialogResult[mbf]).format('DD/MM/YYYY');
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
    this.api.updateMember(memberId, this.member)
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

  onClickUnregisterMember(id: any) {
    const message = `Donar de baixa l'associat/da?`;
    const dialogData = new ConfirmDialogModel('Confirmació', message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxHeight: '200px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isLoadingResults = true;
        this.api.unregisterMember(id)
          .subscribe(resok => {
            this.member = resok.result;
            this.memberInmutable = { ...this.member };
            this.isLoadingResults = false;
          }, (resko) => {
            handle(resko, this.durationInSeconds, this.alerter);
            this.isLoadingResults = false;
          }
          );
      }
    });
  }
}
