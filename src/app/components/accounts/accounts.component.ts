import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AccountResponse } from '../../models/account/AccountResponse';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [FormsModule, RouterModule, NgbTooltipModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit{
  accountsList : AccountResponse[] = [];
  private apiService = inject(ApiService);
  searchText: string = '';
  filteredAccountsList: AccountResponse[]=[];

  ngOnInit():void {
    this.getAccountsList();
  }

  search() {
    console.log("search text: ", this.searchText);
    const updatedSearchText = this.searchText.toLowerCase();
    if (this.searchText) {
      this.filteredAccountsList = this.accountsList.filter(user => {
        return user.firstName.toLowerCase().includes(updatedSearchText)
          || user.username.toLowerCase().includes(updatedSearchText);
      })
      return;
    }
    this.filteredAccountsList = this.accountsList;
    console.log("Filtered car list: ", this.filteredAccountsList);
  }

  clearSearch() {
    this.searchText = "";
    this.search();
  }

  getAccountsList(){
    this.apiService.request('accountsList', 'get').subscribe((accounts: any)=>{
      console.log("users: ", accounts);
      this.accountsList=accounts;
      this.filteredAccountsList=accounts;
    })
  }

  deleteUser(id: string) {
    this.apiService.request('deleteAccount', 'delete', undefined, id).subscribe(result => {
      console.log(`The user with the id - ${id} was deleted`);
      this.accountsList = this.accountsList.filter(account => account.accountID !== id);
      this.filteredAccountsList = this.accountsList;
      // this.storageService.set('users', this.usersList);
    })
  }

}
