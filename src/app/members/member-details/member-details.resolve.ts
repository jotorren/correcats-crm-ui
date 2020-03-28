import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MemberService } from '../member.service';
import { Associada } from '../associada';

@Injectable()
export class MemberDetailsResolve implements Resolve<Associada> {

    constructor(private service: MemberService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        const id = route.params.id;

        if (id) {
            const result = this.service.getMemberById(id);
            if (result) {
                return result;
            }
        }

        this.router.navigate(['/members-list']);
        return false;
    }
}
