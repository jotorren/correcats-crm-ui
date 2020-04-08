import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { debounceTime, tap, map, filter } from 'rxjs/operators';
import { MemberService } from '../member.service';
import { Associada } from '../associada';
import { Config, Result, ConfirmDialogModel, ConfirmDialogComponent } from '../../shared';
import { handle } from '../../shared/error/error-handlers';
import { AlertService } from '../../shared/alert/alert.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

  private pan = new Subject<string>();

  @ViewChild('usertabs') tabs: MatTabGroup;

  smallScreen: boolean;
  member: Associada;
  isLoadingResults = false;

  durationInSeconds = 2;

  constructor(
    private route: ActivatedRoute,
    private api: MemberService,
    private router: Router,
    public dialog: MatDialog,
    private alerter: AlertService,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.smallScreen = result.matches;
    });

    this.route.data.forEach((data: { api: Result }) => {
      this.member = data.api.result;
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

  unregisterMember(id: any) {
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
          .subscribe(res => {
            this.isLoadingResults = false;
            this.router.navigate(['/members-list']);
          }, (err) => {
            handle(err, this.durationInSeconds, this.alerter);
            this.isLoadingResults = false;
          }
          );
      }
    });
  }

}
