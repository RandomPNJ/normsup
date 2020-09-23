import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  // myForm = this.fb.group({
  //   password: ['', [Validators.required]],
  //   confirmPassword: ['']
  // }, {validator: this.checkPasswords });
  unamePattern = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$";
  passwordOne: string = '';
  passwordTwo: string = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  // checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  //   let pass = group.get('password').value;
  //   let confirmPass = group.get('confirmPass').value;

  //   return pass === confirmPass ? null : { notSame: true }     
  // }

  changePassword() {
    let reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    console.log(reg.test(this.passwordOne)); 
  }
}
