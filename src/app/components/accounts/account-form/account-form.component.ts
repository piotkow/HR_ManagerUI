import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountApi, AccountEmployeeResponse, Role } from '../../../../../libs/api-client';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css'
})
export class AccountFormComponent {
  userForm?: FormGroup;
  userId: string | null = '';
  userDetails: AccountEmployeeResponse | any = {};
  currentRoute: string = '';
  roles: string[] = Object.values(Role);
  uploadedFileUrl: string = '';
  selectedImage: string = '';
  typedUsername: string = '';
  usernameExists: boolean = false;
  isLoading: boolean = false;

  maxFileSize = 9999242225555555555559999;
  fileSizeErrorMsg = 'File is too big';

  passwordErrorMessages = {
    required: 'Password is required',
    length: 'password must be between 8 and 20 characters',
    lowercase: 'at least one lowercase letter',
    uppercase: 'at least one uppercase letter',
    digit: 'at least one digit',
    symbol: 'at least one special character (!, @, #, $, %, ^, &, *, ())',
  };
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private accountApi: AccountApi,
    private router: Router,

    // private loadingService: LoadingService,

  ) { }
  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.checkUsername();
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [
        Validators.required,
        this.createPatternValidator(/^(?=.*[a-z])/, 'lowercase'),
        this.createPatternValidator(/^(?=.*[A-Z])/, 'uppercase'),
        this.createPatternValidator(/^(?=.*\d)/, 'digit'),
        this.createPatternValidator(/^(?=.*[!@#$%^&*()])/, 'symbol'),
        this.createPatternValidator(/^[a-zA-Z\d!@#$%^&*()]{8,20}$/, 'length')
      ]],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phone: ['', Validators.required],
      avatar: ['']
    })
    if (this.userId) {
      this.getUser();
    }
  }
  createPatternValidator(regex: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = regex.test(control.value);
      return valid ? null : { [errorKey]: this.passwordErrorMessages };
    };
  }
  getUser() {
    if(this.userId){
    this.accountApi.apiAccountIdGet({id:Number(this.userId)}).subscribe(user => {
      if (user) {
        this.userForm?.patchValue(user);
        this.userDetails = user;
        if (this.userDetails.avatar) {
          this.selectedImage = this.userDetails.avatar;
        }
      }
    })
  }
  }
  saveUser() {
    console.log('Values from user form: ', this.userForm?.value);
    this.accountApi.apiAccountPost(this.userForm?.value).subscribe(result => {
      console.log('Add user result: ', result);
      if (result) {
        Swal.fire('Success', 'You have successfully added an user', 'success').then(swalResult => {
          console.log('Swal result: ', swalResult);
          if (swalResult.value) this.router.navigate(['/users']);
        });
      }
    });
  }
  editUser() {
    this.accountApi.apiAccountIdPut({id:Number(this.userId)}, this.userForm?.value).subscribe(async result => {
      console.log('Edit car result: ', result);
      console.log('Request Payload: ', this.userForm?.value);
      if (result) {
        const { value: redirecturl } = await Swal.fire(
          'Success',
          'The user details have been updated successfully',
          'success'
        );
        console.log('redirecturl: ', redirecturl);

        if (redirecturl) {
          this.router.navigate(['/admin-dashboard']); // ZMIENIC POZNIEJ NA ACCOUNTS
        }
      }
    })
  }
  clearRole() {
    this.userForm?.controls['role'].setValue('');
  }

  uploadAvatar(event: any) {
    console.log('event: ', event);
    const fileUpload = event.target.files[0];
    console.log('File upload: ', fileUpload);

    const formData: FormData = new FormData();
    formData.append('avatar', fileUpload, fileUpload.name);

    if (fileUpload) {
      this.apiService.request('uploadAvatar', 'post', formData).subscribe((result: any) => {
        console.log('Uploaded file: ', result);
        if (result) {
          this.uploadedFileUrl = result.secureUrl;
          this.userForm?.controls['avatar'].setValue(this.uploadedFileUrl);
          this.userDetails.avatar = this.uploadedFileUrl;
          this.selectedImage = this.uploadedFileUrl;
        }
      })
    }
  }

  checkUsername() {

    this.apiService.request('checkUsername', 'get', undefined, this.typedUsername, undefined).subscribe(
      (response: any) => {
        this.usernameExists = response;
        const usernameControl = this.userForm?.get('username');
        if (this.usernameExists) {
          usernameControl?.setErrors(null);
        } else {
          usernameControl?.setErrors({ usernameExists: true });
        }
      }
    );
  }
}
