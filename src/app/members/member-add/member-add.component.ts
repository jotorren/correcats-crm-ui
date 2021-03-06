import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, from, Subject } from 'rxjs';
import { debounceTime, tap, switchMap, finalize, map, startWith, filter } from 'rxjs/operators';
import { Config, Result, AuthenticationService } from '../../shared';
import { MemberErrorStateMatcher } from '../../shared/error.state.matcher';
import { ErrorListComponent } from '../../shared/error/error.component';
import { handle } from '../../shared/error/error-handlers';
import { AlertService } from '../../shared/alert/alert.service';
import { CatalogService, Municipi, CodiPostal } from '../../shared/catalog.service';
import { PostalCodesDialogComponent } from '../../shared/dialog/postalcodes-dialog.component';
import { MemberService } from '../member.service';
import { MemberValidatorService } from '../member-validator.service';
import { LogService } from 'src/app/shared/log/log.service';
import { AppGlobalService } from 'src/app/app.global.service';

@Component({
  selector: 'app-member-add',
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.scss']
})
export class MemberAddComponent implements OnInit {

  private postalCode2City = new Subject<string>();
  private pan = new Subject<string>();

  memberForm: FormGroup;
  @ViewChild('codiPostal') cp: ElementRef;
  @ViewChild('stepper') stepper: MatStepper;

  smallScreen: boolean;

  // firstFormGroup: FormGroup;
  // secondFormGroup: FormGroup;
  // thirdFormGroup: FormGroup;

  durationInSeconds = 2;
  isLinear = false;
  secondStepisOptional = true;

  cities: Municipi[] = [];
  filteredCities: Observable<Municipi[]> = from([]);
  emptyCitiesList = [{ codi: '00000', nom: 'Introdueix 3 lletres qualsevols del nom' }];
  selectedCityCode: string;
  postalCodes: CodiPostal[] = [];
  filteredCodes: Observable<CodiPostal[]> = from([]);

  isLoadingResults = false;
  matcher = new MemberErrorStateMatcher();
  roles = Config.security.roles;

  // get formArray(): AbstractControl | null { return this.memberForm.get('formArray'); }

  constructor(
    public authService: AuthenticationService,
    private app: AppGlobalService,
    private router: Router,
    private api: MemberService,
    private formBuilder: FormBuilder,
    private alerter: AlertService,
    private snackBar: MatSnackBar,
    private catalog: CatalogService,
    private dialog: MatDialog,
    private validators: MemberValidatorService,
    private breakpointObserver: BreakpointObserver,
    private log: LogService) {
      this.app.setTitle('Alta d\' un nou associat');
    }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.smallScreen = result.matches;
    });

    this.pan
      .pipe(
        debounceTime(Config.ui.debounceTime)
      )
      .subscribe(action => {
        if (action === 'previous') {
          this.stepper.previous();
        } else {
          this.stepper.next();
        }
      });

    // this.memberForm = this.formBuilder.group({
    //   formArray: this.formBuilder.array([
    //     this.formBuilder.group({
    //       nom : [null, Validators.required],
    //       cognoms : [null, Validators.required],
    //       nick : [null, Validators.required],
    //       email : [null, Validators.required],
    //       nif : [null],
    //       iban : [null],
    //     }),
    //     this.formBuilder.group({
    //       telefon : [null],
    //       adreca : [null],
    //       codiPostal : [null],
    //       poblacio : [null],
    //       quotaAlta : [null],
    //       dataAlta : [null],
    //     }),
    //     this.formBuilder.group({
    //       observacions: [null],
    //     }),
    //   ])
    // });

    // this.firstFormGroup = this.formBuilder.group({
    //   nom : [null, Validators.required],
    //   cognoms : [null, Validators.required],
    //   nick : [null, Validators.required],
    //   email : [null, Validators.required],
    //   nif : [null],
    //   iban : [null],
    // });

    // this.secondFormGroup = this.formBuilder.group({
    //   telefon : [null],
    //   adreca : [null],
    //   codiPostal : [null],
    //   poblacio : [null],
    //   quotaAlta : [null],
    //   dataAlta : [null],
    // });

    // this.thirdFormGroup = this.formBuilder.group({
    //   observacions: [null],
    // });

    // this.memberForm = this.formBuilder.group({
    //   formArray: this.formBuilder.array([this.firstFormGroup, this.secondFormGroup, this.thirdFormGroup])
    // });

    this.memberForm = this.formBuilder.group({
      nom: [null, Validators.required],
      cognoms: [null, Validators.required],
      sexe: ['H'],
      nick: [null, {
        validators: Validators.required,
        asyncValidators: this.validators.nickValidator,
        updateOn: 'blur'
      }],
      email: [null, {
        validators: [Validators.required,Validators.email],
        asyncValidators: this.validators.emailValidator,
        updateOn: 'blur'
      }],
      nif: [null, Validators.pattern],
      iban: [null, Validators.pattern],

      telefon: [null],
      adreca: [null],
      codiPostal: [null],
      poblacio: [null],
      quotaAlta: [null, Validators.pattern],
      dataAlta: [null],

      observacions: [null, Validators.maxLength],
    }, { updateOn: 'change' });

    this.filteredCodes = this.memberForm.get('codiPostal').valueChanges
      .pipe(
        startWith(''),
        map(value => this.postalCodes.filter(option =>
          (value === '' || value === null) || option.valor.toLowerCase().startsWith(value)))
      );

    this.filteredCities = this.memberForm.get('poblacio').valueChanges
      .pipe(
        debounceTime(500),
        // tap(() => {
        //   this.isLoadingResults = true;
        // }),
        switchMap(value => {
          console.log(this.memberForm.value.codiPostal + ' ' + this.memberForm.value.poblacio);
          if (this.memberForm.value.codiPostal) {
            return [this.cities];
          } else if (value && value.length > 2) {

            return this.catalog.getCities(value + '')
              .pipe(
                tap(data => {
                  data.forEach(item => this.log.debug(item));
                }),
                // finalize(() => {
                //   this.isLoadingResults = false;
                // }),
              );
          } else {
            // this.isLoadingResults = false;
            return from([this.emptyCitiesList]);
          }
        }),
        map(data => {
          this.cities = data;
          return data;
        })
      );

    this.postalCode2City.subscribe(codiPostal => {
      this.catalog.getCitiesWithPostalCode(codiPostal)
        .subscribe(data => {
          if (data && data.length > 0) {
            this.cities = data;
          } else {
            this.cities = this.emptyCitiesList;
          }
        });
    });
  }

  onCodiPostalChange(event) {
    if (this.memberForm.value.codiPostal) {
      this.postalCode2City.next(this.memberForm.value.codiPostal);
    } else {
      this.postalCode2City.next('00000');
    }
  }

  onPoblacioSelected(event) {
    this.selectedCityCode = event.option.id;
  }

  onFocusPoblacio(event) {
    this.memberForm.get('poblacio').updateValueAndValidity({ onlySelf: true, emitEvent: true });
  }

  onPanLeft(event) {
    this.pan.next('next');
  }

  onPanRight(event) {
    this.pan.next('previous');
  }

  onVerifyData() {
    if (!this.memberForm.value.nick || !this.memberForm.value.email) {
      return;
    }

    this.isLoadingResults = true;

    this.api.verifyMember(this.memberForm.value.nick, this.memberForm.value.email)
      .subscribe((resok: Result) => {
        this.isLoadingResults = false;
        if (resok.result) {
          const messages: string[] = resok.result;
          let observacions = '';
          if (messages.length > 0) {
            messages.forEach(msg => {
              observacions = observacions.concat(msg).concat('\n');
            });
          } else {
            this.snackBar.open('Nick/eMail comprobats', 'OK', { duration: 2000 });
          }
          this.memberForm.get('observacions').setValue(observacions);
        }
      }, (resko: any) => {
        this.isLoadingResults = false;
        handle(resko, this.durationInSeconds, this.alerter);
      });
  }

  onFormSubmit() {
    this.isLoadingResults = true;

    // To show a set of errors
    let formData: any = {};
    if (this.memberForm.value.codiPostal !== '666') {
      formData = {...this.memberForm.value};
    }
    //

    // date to string converison dd/MM/yyyy
    // if (this.memberForm.value.dataAlta) {
    //   formData.dataAlta = moment(this.memberForm.value.dataAlta).format('DD/MM/YYYY');
    // }

    this.api.addMember(formData)
      .subscribe((resok: any) => {
        this.isLoadingResults = false;
        this.router.navigate(['/member-details', resok.result]);
      }, (resko: any) => {

        // let messages = '';
        // if (resko.error.errors) {
        //   resko.error.errors.map(item => item.message).forEach(item => {
        //     myduration++;
        //     messages = messages + '<li>' + item + '</li>';
        //   });
        // } else {
        //   messages = JSON.stringify(resko.error);
        // }
        // this.alerter.error(messages, {
        //   autoClose: true,
        //   duration: myduration * 1000,
        //   keepAfterRouteChange: false
        // });

        // let messages;
        // if (resko.error.errors) {
        //   messages = resko.error.errors.map(item => item.message);
        //   myduration = myduration + messages.length;
        // } else {
        //   messages = [JSON.stringify(resko.error)];
        // }
        // this.snackBar.openFromComponent(ErrorListComponent, {
        //     duration: myduration * 1000,
        //     data: messages
        // });

        handle(resko, this.durationInSeconds, this.alerter);
        this.isLoadingResults = false;
      });
  }

  openCitiesAndPostalCodesDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};

    const dialogRef = this.dialog.open(PostalCodesDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.memberForm.get('codiPostal').setValue(dialogResult);
        this.postalCode2City.next(this.memberForm.value.codiPostal);
      }
    });
  }

  private debugPostalCodes() {
    this.postalCodes.forEach(pc => this.log.debug(pc));
  }

  private debugCities() {
    this.cities.forEach(ci => this.log.debug(ci));
  }
}
