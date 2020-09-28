import { Component, OnInit } from '@angular/core';
import { FormControl, FormArray, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match.validator';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  registerForm: FormGroup;
  submitted: Boolean = false;
  token = '';
  type = '';
  resetPwdForm = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  
  unamePattern = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$";
  passwordOne: string = '';
  passwordTwo: string = '';

  constructor(private router: Router, private formBuilder: FormBuilder, private httpService: HttpService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get("token");
    this.type = this.route.snapshot.paramMap.get("type");

    if(this.token) {
      this.registerForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
        confirmPassword: ['', Validators.required]
      }, {
          validator: MustMatch('password', 'confirmPassword')
      });
    } else {
      this.router.navigate(['dashboard'])
    }
  }


  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    console.log('this.registerForm', this.registerForm.value);
    this.httpService.post('/api/auth/reset_password/modify', {token: this.token, password: this.registerForm.value.password})
      .subscribe(res => {
        console.log('reset_password/modify res : ', res);
      }, err => {
        console.log('reset_password/modify err : ', err);
      })
    ;
  }
}
