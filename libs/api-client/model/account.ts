/**
 * API IP32
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Role } from './role';
import { Employee } from './employee';


export interface Account { 
    accountID?: number;
    employeeID: number;
    username: string;
    password: string;
    accountType: Role;
    employee?: Employee;
}
export namespace Account {
}


