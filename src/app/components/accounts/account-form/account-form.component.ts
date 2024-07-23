import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountApi, AccountEmployeeResponse, EmployeeApi, EmployeeRequest, Position, PositionApi } from '../../../../../libs/api-client';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Role } from '../../../../../libs/api-client/model/role';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { EmployeeFormComponent } from "../../employee/employee-form/employee-form.component";
import { CalendarModule } from 'primeng/calendar';


@Component({
  selector: 'app-account-form',
  standalone: true,
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, InputTextModule, DropdownModule, FileUploadModule, EmployeeFormComponent, CalendarModule]
})
export class AccountFormComponent {
  accountEmployeeForm?: FormGroup;

  accountDetails: AccountEmployeeResponse | any = {};
  currentRoute: string = '';
  accountId: number = 0;
  selectedImage: string = '';
  typedUsername: string = '';
  usernameExists: boolean = false;
  isLoading: boolean = false;
  uploadedFile: any;
  roles: Role[] = Object.values(Role);
  positions: Position[] = [];
  uploadedFileUrl: string = '';
  employeeId: string | null = '';

  passwordErrorMessages = {
    required: 'Password is required',
    length: 'password must be between 8 and 20 characters',
    lowercase: 'at least one lowercase letter',
    uppercase: 'at least one uppercase letter',
    digit: 'at least one digit',
    symbol: 'at least one special character (!, @, #, $, %, ^, &, *, ())',
  };

  maxFileSize = 9999242225555555555559999;
  fileSizeErrorMsg = 'File is too big';

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private accountApi: AccountApi,
    private router: Router,
    private positionApi: PositionApi,
    private employeeApi: EmployeeApi
  ) { }

  ngOnInit(): void {
    console.log("id przed: ", this.accountId);
    this.accountId = Number(this.activatedRoute.snapshot.paramMap.get('id'))
    // this.accountId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("id po: ", this.accountId);
    this.checkUsername();
    this.getPositions();
    this.employeeId = this.activatedRoute.snapshot.paramMap.get('id');

    this.accountEmployeeForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [
        Validators.required,
        this.createPatternValidator(/^(?=.*[a-z])/, 'lowercase'),
        this.createPatternValidator(/^(?=.*[A-Z])/, 'uppercase'),
        this.createPatternValidator(/^(?=.*\d)/, 'digit'),
        this.createPatternValidator(/^(?=.*[!@#$%^&*()])/, 'symbol'),
        this.createPatternValidator(/^[a-zA-Z\d!@#$%^&*()]{8,20}$/, 'length')
      ]],
      accountType: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      postalCode: ['', Validators.required],
      dateOfEmployment: ['', Validators.required],
      positionID: ['', Validators.required],
      teamID: ['']
    })

    if (this.accountId) {
      this.getAccount();
    }
  }

  getAccount() {
    if (this.accountId) {
      this.accountApi.apiAccountIdGet({ id: Number(this.accountId) }).subscribe(user => {
        if (user) {
          this.accountEmployeeForm?.patchValue(user);
          this.accountDetails = user;
          if (this.accountDetails) {
            this.selectedImage = this.accountDetails.avatar;
          }
        }
      })
    }
  }

  saveUser() { 
    console.log('Values from user form: ', this.accountEmployeeForm);
    const employeeRequest : EmployeeRequest = {
      firstName: this.accountEmployeeForm?.get('firstName')?.value,
      lastName: this.accountEmployeeForm?.get('lastName')?.value,
      email: this.accountEmployeeForm?.get('email')?.value,
      phone: this.accountEmployeeForm?.get('phone')?.value,
      country: this.accountEmployeeForm?.get('country')?.value,
      city: this.accountEmployeeForm?.get('city')?.value,
      street: this.accountEmployeeForm?.get('street')?.value,
      postalCode: this.accountEmployeeForm?.get('postalCode')?.value,
      dateOfEmployment: this.accountEmployeeForm?.get('dateOfEmployment')?.value.toISOString(),
      positionID: this.accountEmployeeForm?.get('positionID')?.value,
      teamID: null
    };

    console.log("obiekt:",employeeRequest);
    this.employeeApi.apiEmployeePost({employeeRequest: employeeRequest}).subscribe(result => {
      if (result) {
        console.log("dodawanie emp:",result);
        const accountRequest = {
          username: this.accountEmployeeForm?.get('username')?.value,
          password: this.accountEmployeeForm?.get('password')?.value,
          accountType: this.accountEmployeeForm?.get('accountType')?.value,
          employeeID: result.employeeID
        };
        this.accountApi.apiAccountPost({accountRequest: accountRequest}).subscribe(result=>{
          console.log("dodawanie acc:",result);
        })
      }
    });
  }

  editUser() {
    this.accountApi.apiAccountIdPut({ id: Number(this.accountEmployeeForm) }, this.accountEmployeeForm?.value).subscribe(async result => {
      console.log('Edit car result: ', result);
      console.log('Request Payload: ', this.accountEmployeeForm?.value);
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
    this.accountEmployeeForm?.controls['role'].setValue('');
  }

  createPatternValidator(regex: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = regex.test(control.value);
      return valid ? null : { [errorKey]: this.passwordErrorMessages };
    };
  }

  getPositions() {
    this.positionApi.apiPositionGet().subscribe(result => {
      this.positions = result;
    })
  }

  checkUsername() {
    // this.apiService.request('checkUsername', 'get', undefined, this.typedUsername, undefined).subscribe(
    //   (response: any) => {
    //     this.usernameExists = response;
    //     const usernameControl = this.userForm?.get('username');
    //     if (this.usernameExists) {
    //       usernameControl?.setErrors(null);
    //     } else {
    //       usernameControl?.setErrors({ usernameExists: true });
    //     }
    //   }
    // );
  }

  uploadAvatar(event: any) {
    // console.log('event: ', event);
    // const fileUpload = event.target.files[0];
    // console.log('File upload: ', fileUpload);

    // if (fileUpload) {
    //   this.employeeApi.apiEmployeeUploadPhotoPost(fileUpload).subscribe((result: any) => {
    //     console.log('Uploaded file: ', result);
    //     if (result) {
    //       this.uploadedFileUrl = result.secureUrl;
    //       this.accountEmployeeForm?.controls['avatar'].setValue(this.uploadedFileUrl);
    //       this.employeeDetails.avatar = this.uploadedFileUrl;
    //       this.selectedImage = this.uploadedFileUrl;
    //     }
    //   })
    // }
  }
}
