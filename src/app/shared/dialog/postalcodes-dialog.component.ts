import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, from, Subject } from 'rxjs';
import { debounceTime, tap, switchMap, finalize, map, startWith, filter } from 'rxjs/operators';
import { CatalogService, Municipi, CodiPostal } from '../../shared/catalog.service';

@Component({
    selector: 'app-postalcodes-dialog',
    templateUrl: './postalcodes-dialog.component.html',
    styleUrls: ['./postalcodes-dialog.component.scss']
})
export class PostalCodesDialogComponent implements OnInit {
    searchForm: FormGroup;
    selectedOption: Municipi;

    potentialCities: Observable<Municipi[]>;

    postalCodesList: CodiPostal[] = [];
    postalCode: string[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private catalog: CatalogService,
        private dialogRef: MatDialogRef<PostalCodesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any ) {
    }

    ngOnInit() {
        this.dialogRef.updateSize('80%', '80%');

        this.searchForm = this.formBuilder.group({
            city : [null]
        });

        this.potentialCities = this.searchForm.get('city').valueChanges
            .pipe(
                tap(() => {
                    this.postalCodesList = [];
                }),
                debounceTime(500),
                switchMap(value => {
                    if (this.selectedOption) {
                        const res = from([[this.selectedOption]]);
                        this.selectedOption = null;
                        return res;
                    } else if (value && value.length > 2) {
                        return this.catalog.getCities(value + '');
                    } else {
                        return from([]);
                    }
                })
            );
    }

    searchPostalCodes(city: Municipi) {
        this.selectedOption = city;
        this.searchForm.get('city').updateValueAndValidity({ onlySelf: true, emitEvent: true });
        this.catalog.getPostalCodes(city.codi)
            .subscribe(data => {
                this.postalCodesList = data;
            });
    }

    onFocus(event) {
        this.searchForm.get('city').updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }

    onDismiss() {
        this.dialogRef.close();
    }

    onConfirm() {
        this.dialogRef.close(this.postalCode[0]);
    }
}
