import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthenticationService } from './shared/security/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  get logged(): boolean {
    return null != this.authService.getToken();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
