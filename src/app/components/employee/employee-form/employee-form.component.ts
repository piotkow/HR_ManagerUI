import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, AccountApi, EmployeeApi, EmployeePositionTeamResponse, PhotoApi, Position, PositionApi } from '../../../../../libs/api-client';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, InputTextModule, DropdownModule, FileUploadModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {

  employeeForm?: FormGroup;
  employeeId: string | null = '';
  employeeDetails: EmployeePositionTeamResponse | any = {};
  uploadedFileUrl: string = '';
  selectedImage: string = '';
  uploadedFile: any;
  positions: Position[] = [];
  

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private employeeApi: EmployeeApi,
    private positionApi: PositionApi,
    private accountApi: AccountApi,
    private photoApi: PhotoApi

  ) { }

  ngOnInit(): void {
    console.log("employeeid:",this.employeeId);
    this.employeeId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("employeeid:",this.employeeId);
    this.getPositions();

    this.employeeForm = this.formBuilder.group({
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
      this.getUser();
    }
  }

  getUser() {
    if(this.employeeId){
    this.employeeApi.apiEmployeeIdGet({id:Number(this.employeeId)}).subscribe(user => {
      if (user) {
        this.employeeForm?.patchValue(user);
        this.employeeDetails = user;
      }
    })
  }
  }

  saveEmployee() {
    this.employeeApi.apiEmployeePost({employeeRequest:this.employeeForm?.value}).subscribe(result => {
      if (result) {

      }
    });
  }

  editUser() {
    this.employeeApi.apiEmployeeIdPut({id:Number(this.employeeId)}, this.employeeForm?.value).subscribe(async result => {
      if (result) {
        const { value: redirecturl } = await Swal.fire(
          'Success',
          'The user details have been updated successfully',
          'success'
        );
        if (redirecturl) {
          this.router.navigate(['/admin-dashboard']);
        }
      }
    })
  }

  uploadAvatar(event: any) {
    const fileUpload = event.target.files[0];

    if (fileUpload && this.employeeId) {
      this.photoApi.apiPhotoUploadPhotoEmployeeIdPost({photo: fileUpload, employeeId: Number(this.employeeId)}).subscribe((result: any) => {
        if (result) {
          this.uploadedFileUrl = result.secureUrl;
          this.employeeForm?.controls['avatar'].setValue(this.uploadedFileUrl);
          this.employeeDetails.avatar = this.uploadedFileUrl;
          this.selectedImage = this.uploadedFileUrl;
        }
      })
    }
  }

  getPositions(){
    this.positionApi.apiPositionGet().subscribe(result=>{
      this.positions=result;
    })
  }

}
