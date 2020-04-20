import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MemberService } from '../member.service';
import { AssociadaInfantil } from '../associada.infantil';

@Injectable()
export class MemberChildDetailsResolve implements Resolve<AssociadaInfantil> {

    constructor(private service: MemberService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        const id = route.params.id;

        if (id) {
            const result = this.service.getChildMemberById(id);
            if (result) {
                return result;
            }
        }

        this.router.navigate(['/member-children-list']);
        return false;
    }
}
