import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AbsenceEmployeeResponse } from '../../models/absence/AbsenceEmployeeResponse.ts';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './hr-dashboard.component.html',
  styleUrl: './hr-dashboard.component.css'
})
export class HrDashboardComponent {
  absencesList: AbsenceEmployeeResponse[] = [];
  searchText: string = '';
  filteredabsencesList: AbsenceEmployeeResponse[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  // ngOnInit(): void {
  //   this.getCoachingList();
  // }

  // getCoachingList() {
  //   this.apiService.request('absenceList', 'get').subscribe((coachings: any) => {
  //     this.coachingList = coachings;
  //     this.filteredCoachingsList = this.coachingList;
  //   })
  // }

  // search() {
  //   const updatedSearchText = this.searchText.toLowerCase();
  //   if (this.searchText) {
  //     this.filteredCoachingsList = this.coachingList.filter(coaching => {
  //       return coaching.topic.toLowerCase().includes(updatedSearchText)
  //         || coaching.location.toLowerCase().includes(updatedSearchText);
  //     })
  //     return;
  //   }
  //   this.filteredCoachingsList = this.coachingList;

  // }

  // clearSearch() {
  //   this.searchText = "";
  //   this.search();
  // }

  // deleteCoaching(id: string) {
  //   this.apiService.request('deleteCoaching', 'delete', undefined, id).subscribe(result => {
  //     this.coachingList = this.coachingList.filter(coaching => coaching.coachingID !== id);
  //     this.filteredCoachingsList = this.coachingList;
  //   })
  // }
}
