import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AlertService } from '../alert/alert.service';
import { first } from 'rxjs/operators';
import { LogService } from '../log/log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  hide = true;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private log: LogService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  login() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.authService.login(this.f.username.value, this.f.password.value)
    .pipe(first())
    .subscribe(
      resok => {
        this.router.navigate(['/members-list']);
      },
      resko => {
        let messages;
        if (resko.error.error_description) {
          messages = resko.error.error_description;
        } else {
          this.log.error(resko.error);
          messages = 'Autenticació incorrecta';
        }

        this.alertService.error(messages, {
          autoClose: true,
          keepAfterRouteChange: false
        });
        this.loading = false;
      }
    );
  }
}
