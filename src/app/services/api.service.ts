import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'https://localhost:7154/api/';
  private http: HttpClient = inject(HttpClient);

  constructor() { }

  endpoints:{[endpoint: string]: string | any}={
    accountsList: `${this.baseUrl}account`,
    deleteAccount: (id: string)=>`${this.baseUrl}account/${id}`
  }

  request(
    url:endpointType,
    method: string,
    payload?: object,
    urlParams?: any
  ){
    const finalUrl = !urlParams
      ? this.endpoints[url]
      : this.endpoints[url](urlParams);

    return payload
      ? this.http.request(method, finalUrl)
      : this.http.request(method, finalUrl, {body: payload});
  }
}

export type endpointType = 'accountsList' | 'deleteAccount';
