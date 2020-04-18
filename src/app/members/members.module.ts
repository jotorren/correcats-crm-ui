import { NgModule } from '@angular/core';
import * as Hammer from 'hammerjs';
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from '../app-routing.module';
import { MemberAddComponent } from './member-add/member-add.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MembersListComponent } from './members-list/members-list.component';
import { MemberService } from './member.service';
import { MemberValidatorService } from './member-validator.service';
import { MemberDetailsResolve } from './member-details/member-details.resolve';
import { MemberExportComponent } from './member-export/member-export.component';
import { SharedModule } from '../shared';
import { MemberReportComponent } from './member-report/member-report.component';
import { MemberFindComponent } from './member-find/member-find.component';
import { DatePipe } from '@angular/common';

export const MY_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'DD/MM/YYYY',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

export class MyHammerConfig extends HammerGestureConfig  {
    overrides = {
        // override hammerjs default configuration
        pan: { direction: Hammer.DIRECTION_HORIZONTAL }
    } as any;
  }

@NgModule({
    imports: [
        HammerModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatStepperModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTabsModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatListModule,
        MatRadioModule,
        MatExpansionModule,
        MatBadgeModule,
        FlexLayoutModule,
        AppRoutingModule,
        SharedModule
    ],
    declarations: [
        MemberAddComponent,
        MemberDetailsComponent,
        MemberEditComponent,
        MembersListComponent,
        MemberExportComponent,
        MemberReportComponent,
        MemberFindComponent
    ],
    exports: [
        MemberAddComponent,
        MemberDetailsComponent,
        MemberEditComponent,
        MembersListComponent
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        DatePipe,
        { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
        MemberService,
        MemberValidatorService,
        MemberDetailsResolve
    ],
    entryComponents: []
})
export class MembersModule {
}
