import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-errors-list',
    template: `
    <mat-list>
        <mat-list-item *ngFor="let message of data">
            <span class="alert alert-danger"><mat-icon>error</mat-icon>{{message}}</span>
        </mat-list-item>
    </mat-list>`,
    styles: [`
    .alert-danger {
        border-color: #ffffff;
        background-color: #ffffff;
        font-size: 90%;
    }
    `]
})
export class ErrorListComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
