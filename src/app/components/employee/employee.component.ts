import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

  employeeID: string | null = '';

  constructor(
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(){
    this.employeeID = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("id:",this.employeeID);
  }
}
