import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './shared/security/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthenticationService, private router: Router) { }

  get logged(): boolean {
    return null != this.authService.getToken();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
