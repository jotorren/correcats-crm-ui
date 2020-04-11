import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { handle } from '../../shared/error/error-handlers';
import { AlertService } from '../../shared/alert/alert.service';
import { Config } from '../../shared';
import { MemberService } from '../member.service';
import { LogService } from 'src/app/shared/log/log.service';
import { AppGlobalService } from 'src/app/app.global.service';

@Component({
  selector: 'app-member-report',
  templateUrl: './member-report.component.html',
  styleUrls: ['./member-report.component.scss']
})
export class MemberReportComponent implements OnInit {

  isLoadingResults = false;
  durationInSeconds = 2;

  requestedFiles: Array<string> = new Array<string>();
  downloadableFiles: Array<string> = new Array<string>();
  sub: Subscription;

  constructor(
    private app: AppGlobalService,
    private api: MemberService,
    private alerter: AlertService,
    private snackBar: MatSnackBar,
    private log: LogService
  ) {
    this.app.setTitle('Descarrega un fitxer predefinit');
  }

  ngOnInit(): void {
    this.sub = this.api.live()
      .subscribe(
        data => {
          this.requestedFiles = this.requestedFiles.filter(item => item !== data);
          this.downloadableFiles.unshift(data);
          this.snackBar.open('El fitxer "' + data + '" ja es pot descarregar', 'OK', { duration: 4000,  verticalPosition: 'top' });
        },
        err => {
          this.log.error(err);
          this.sub.unsubscribe();
        },
        () => {
          this.sub.unsubscribe();
        }
      );
  }

  onClickGetAll(event) {

    this.isLoadingResults = true;
    this.api.export(Config.api.members.query.type.search,
      ['cognoms', 'nom', 'nick', 'email', 'iban'],
      [{ key: 'activat', operation: Config.api.members.query.operators.equals.code, value: true }],
      null, 'cognoms', null)
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

  onClickGetInconsistentEmail(event) {

    this.isLoadingResults = true;
    this.api.export(Config.api.members.query.type.inconsistentEmails, null, null, null, null, null)
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

  onClickGetInconsistentNick(event) {

    this.isLoadingResults = true;
    this.api.export(Config.api.members.query.type.inconsistentNicks, null, null, null, null, null)
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

  onClickGetNotInForumGroup(event) {

    this.isLoadingResults = true;
    this.api.export(Config.api.members.query.type.notInForumGroup,
      ['cognoms', 'nom', 'nick', 'email'], null, null, 'cognoms', null)
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

  onClickGetInForumGroupButNotMember(event) {

    this.isLoadingResults = true;
    this.api.export(Config.api.members.query.type.inForumGroupButNotMember, null, null, null, null, null)
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
        this.snackBar.open('El fitxer "' + file + '" ja es pot descarregar', 'OK', { duration: 2000 });
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
