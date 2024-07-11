import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserType } from '../../enums/user-types';
import { utils } from '../../utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('500ms', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('500ms', style({ opacity: 0, transform: 'scale(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup;
  bgImageSrc = '/images/admin.jpg';
  UserTypes = UserType;
  userType = UserType.ADMIN;
  domain = utils.domain;

  isLoading = false;

  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFormGroup();

    this.activatedRoute.queryParams.subscribe((params: any) => {
      const userType = params['userType'];
      this.userType = userType;
      if (userType) {
        const imageSrc = `/images/${userType}.jpg`;
        this.bgImageSrc = imageSrc;
      }
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  getBgImageClass(): string {
    let bgImageClass = this.bgImageSrc;
    switch (this.userType) {
      case UserType.ADMIN:
        bgImageClass = "bg-[url('/images/admin.jpg')]";
        break;
      case UserType.STUDENT:
        bgImageClass = "bg-[url('/images/student.jpg')]";
        break;
      case UserType.FACULTY:
        bgImageClass = "bg-[url('/images/faculty.jpg')]";
        break;
      case UserType.INSTRUCTOR:
        bgImageClass = "bg-[url('/images/instructor.jpg')]";
        break;
    }

    return bgImageClass;
  }

  handleSignIn() {
    this.isLoading = true;
    this.formGroup.disable();

    const formVal = this.formGroup.getRawValue();
    console.log('formVal: ', formVal);


    setTimeout(() => {
      this.isLoading = false;
      this.formGroup.enable();
    }, 2000);
  }

  handleResetPassword() {

  }
}
