import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountApi, AccountEmployeeResponse, AccountRequest, EmployeeApi, EmployeePositionTeamResponse, EmployeeRequest, PhotoApi, PhotoRequest, Position, PositionApi } from '../../../../../libs/api-client';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Role } from '../../../../../libs/api-client/model/role';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { EmployeeFormComponent } from "../../employee/employee-form/employee-form.component";
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { RefreshDataService } from '../../../services/refresh-data.service';
import { ToastModule } from 'primeng/toast';
import { StorageService } from '../../../services/storage.service';


@Component({
  selector: 'app-account-form',
  standalone: true,
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, InputTextModule, DropdownModule, FileUploadModule, EmployeeFormComponent, CalendarModule, ToastModule]
})
export class AccountFormComponent {
  accountEmployeeForm?: FormGroup;
  accountDetails: AccountEmployeeResponse | any = {};
  employeeDetails?: EmployeePositionTeamResponse;
  currentRoute: string = '';
  selectedImage: string = '';
  typedUsername: string = '';
  usernameExists: boolean = false;
  isLoading: boolean = false;
  uploadedFile: any;
  roles: Role[] = Object.values(Role);
  positions: Position[] = [];
  uploadedFileUrl: string = '';
  employeeId: string | null = '';
  loggedUser?: AccountEmployeeResponse;
  accountId?: number;

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
    private employeeApi: EmployeeApi,
    private messageService: MessageService,
    private photoApi: PhotoApi,
    private refreshService: RefreshDataService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.storageService.get('user');
    this.getPositions();
    this.employeeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getEmployee();
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

    if (this.employeeId) {
      this.getAccount();
    }
  }

  getAccount() {
    if (this.employeeId) {
      this.accountApi.apiAccountByEmployeeEmployeeIdGet({ employeeId: Number(this.employeeId) }).subscribe(account => {
        this.accountId=account.accountID;
        this.employeeApi.apiEmployeeIdGet({ id: Number(this.employeeId) }).subscribe(employee => {
          if (account.dateOfEmployment) {
            this.accountEmployeeForm?.patchValue({
              accountID: account.accountID,
              employeeID: account.employeeID,
              username: account.username,
              password: account.password,
              accountType: account.accountType,
              firstName: account.firstName,
              lastName: account.lastName,
              email: account.email,
              phone: account.phone,
              country: account.country,
              city: account.city,
              street: account.street,
              postalCode: account.postalCode,
              photo: account.photo,
              dateOfEmployment: new Date(account.dateOfEmployment),
              teamID: account.teamID,
              positionID: employee.positionID
            });
            const form = this.accountEmployeeForm?.value;
            this.accountDetails = account;
            if (this.accountDetails) {
              this.selectedImage = this.accountDetails.avatar;
            }
          }
        })
      })
    }
  }

  saveUser() {
    const employeeRequest = {
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

    this.employeeApi.apiEmployeePost({ employeeRequest: employeeRequest }).subscribe(result => {
      if (result) {
        const accountRequest = {
          username: this.accountEmployeeForm?.get('username')?.value,
          password: this.accountEmployeeForm?.get('password')?.value,
          accountType: this.accountEmployeeForm?.get('accountType')?.value,
          employeeID: result.employeeID
        };
        this.accountApi.apiAccountPost({ accountRequest: accountRequest }).subscribe(result => {
          this.router.navigateByUrl('/employee-list');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee added successfully' });
        })
      }
    });
  }

  editUser() {
    const form = this.accountEmployeeForm?.value;
    const accountRequest: AccountRequest={
      employeeID: Number(this.employeeId),
      username:form.username,
      password:form.password,
      accountType:form.accountType
    }

    this.accountApi.apiAccountIdPut({ id: Number(this.accountId), accountRequest: accountRequest}).subscribe({
      next:(result)=>{
       
        const employeeRequest: EmployeeRequest={
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          country:form.country,
          city:form.city,
          street:form.street,
          postalCode: form.postalCode,
          dateOfEmployment:form.dateOfEmployment, 
          positionID: form.positionID,
          teamID: form.teamID
        }
        this.employeeApi.apiEmployeeIdPut({ id: Number(this.employeeId), employeeRequest:employeeRequest  }).subscribe({
          next:(result)=>{
            this.router.navigateByUrl('/employee/'+this.employeeId);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee edited successfully' });
          },
          error: (err)=>{
            console.log('Employee edit error:',err);
          }
        })
      },
      error:(err)=>{
        console.log('Account edit error:',err);
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

  getEmployee(){
    this.employeeApi.apiEmployeeIdGet({id: Number(this.employeeId)}).subscribe(result=>{
      this.employeeDetails=result;
    }
    )
  }

  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      if(this.employeeId)
      this.photoApi.apiPhotoUploadPhotoEmployeeIdPost({ photo: file, employeeId: Number(this.employeeId) }).subscribe({
        next: (result) => {
          var newPhoto: PhotoRequest = {
            employeeID: Number(this.employeeId),
            filename: result.name,
            uri: result.uri
          };
          this.photoApi.apiPhotoPost({ photoRequest: newPhoto }).subscribe({
            next: (result) => {
              this.router.navigateByUrl('/employee/'+this.employeeId);
              this.showSuccess();
              this.refreshService.refresh('logged-user');
            },
            error: (err) => { 
              this.showError();
             }
          })
        },
        error: (err) => { 
          this.showError();
         }
      }
      )
    }
  }

  editPhoto(event: FileUploadEvent){
    for (let file of event.files){
      if(this.employeeDetails?.photo?.fileID && this.employeeId){
    this.photoApi.apiPhotoIdEmployeeIdPut({id: this.employeeDetails?.photo?.fileID, photo: file, employeeId: Number(this.employeeId)}).subscribe({
      next:(res)=>{
        this.router.navigateByUrl('/employee/'+this.employeeId);
        this.showSuccess();
        this.refreshService.refresh('logged-user');
      },
      error: (err)=>{
        console.log(err);
      }
    })
      }
    }
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update Succeed' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occur when update' });
  }
}
