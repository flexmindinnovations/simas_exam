import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserType } from '../../enums/user-types';
import { utils } from '../../utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import crypto from 'crypto-js';

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
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('500ms ease-in-out', style({ opacity: 0, transform: 'scale(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {

  formGroup!: FormGroup;
  bgImageSrc = '/images/admin.jpg';
  UserTypes = UserType;
  userType = UserType.ADMIN;
  domain = utils.domain;

  isLoading = false;

  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      const userType = params['userType'];
      this.userType = userType;
      if (userType) {
        utils.userType.set(userType);
        const imageSrc = `/images/${userType}.jpg`;
        this.bgImageSrc = imageSrc;
      } else {
        this.router.navigateByUrl(`login?userType=${utils.userType()}`);
      }
    })
  }

  ngAfterViewInit(): void {
    utils.setPageTitle('Login');
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      userName: ['', [Validators.required]],
      userPassword: ['', [Validators.required]]
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
    this.authService.createAuthToken(formVal).subscribe({
      next: (response: any) => {
        if (response) {
          const { token, roleId, roleName } = response;
          const userRoleEnc = utils.encryptString(roleName, token);
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('role', userRoleEnc);
          this.isLoading = false;
          this.formGroup.enable();
          this.router.navigateByUrl('app');
          setTimeout(() => {
            utils.setMessages('You\'re successfully logged in.', 'success');
          }, 1500);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.formGroup.enable();
        utils.setMessages(error.message, 'error');
      }
    })
  }

  handleResetPassword() {

  }
}
