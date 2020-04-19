import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './shared/security/authentication.service';
import { AppGlobalService } from './app.global.service';
import { Config } from './shared/config/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  commandSubscription: Subscription;
  title = '';
  roles = Config.security.roles;

  constructor(
    private router: Router,
    private globalService: AppGlobalService,
    public authService: AuthenticationService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

  }

  ngOnInit() {
    // subscribe to new alert notifications
    this.commandSubscription = this.globalService.onCommand(0)
        .subscribe(title => {
          this.title = title.value;
        });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    this.commandSubscription.unsubscribe();
  }

  get logged(): boolean {
    return null != this.authService.getToken();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
