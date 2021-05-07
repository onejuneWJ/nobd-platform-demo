import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SystemLoginService} from '@services/system/system-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginService.login(this.loginForm.getRawValue()).then(() => {
        this.loading = false;
      }, () => {
        this.loading = false;
      }).finally(() => {
        this.loading = false;
      });
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: SystemLoginService
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

}
