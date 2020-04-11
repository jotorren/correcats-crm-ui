import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Command {
    type: number;
    value: any;
}

@Injectable({ providedIn: 'root' })
export class AppGlobalService {
    private subject = new Subject<Command>();

    onCommand(type: number): Observable<Command> {
        return this.subject.asObservable().pipe(filter(x => x && x.type === type));
    }

    setTitle(title) {
        this.subject.next({type: 0, value: title});
    }
}
