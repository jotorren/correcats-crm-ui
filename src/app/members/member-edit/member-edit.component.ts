import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberService } from '../member.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberErrorStateMatcher } from '../../shared/error.state.matcher';
import { LogService } from 'src/app/shared/log/log.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {

  memberForm: FormGroup;
  _id = '';
  name = '';
  gender = '';
  age: number = null;
  address = '';
  city = '';
  country = '';
  status = '';
  statusList = ['Positive', 'Dead', 'Recovered'];
  genderList = ['Male', 'Female'];
  isLoadingResults = false;
  matcher = new MemberErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MemberService,
    private formBuilder: FormBuilder,
    private log: LogService) { }

  ngOnInit(): void {
    this.getMemberById(this.route.snapshot.params.id);
    this.memberForm = this.formBuilder.group({
      name : [null, Validators.required],
      gender : [null, Validators.required],
      age : [null, Validators.required],
      address : [null, Validators.required],
      city : [null, Validators.required],
      country : [null, Validators.required],
      status : [null, Validators.required]
    });
  }

  getMemberById(id: any) {
    this.api.getMemberById(id).subscribe((data: any) => {
      this._id = data._id;
      this.memberForm.setValue({
        name: data.name,
        gender: data.gender,
        age: data.age,
        address: data.address,
        city: data.city,
        country: data.country,
        status: data.status
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateMember(this._id, this.memberForm.value)
      .subscribe((res: any) => {
          const id = res._id;
          this.isLoadingResults = false;
          this.router.navigate(['/member-details', id]);
        }, (err: any) => {
          this.log.error(err);
          this.isLoadingResults = false;
        }
      );
  }

  memberDetails() {
    this.router.navigate(['/member-details', this._id]);
  }

}
