import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import {IBrand} from "../models/Brand";


@Injectable()
export class BrandService {
  brand: IBrand;

  constructor(private http: Http) { }

  // Add Brand
  addBrand(brand) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/brands',
      brand, {headers: headers})
      .map(res => res.json());
  }

  // Get all brand from the database
  getBrand() {
    return this.http.get('http://localhost:3000/brands', null)
      .map(res => res.json());
  }

  // Edit a brand
  updateBrand(brand) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/brands/' + brand._id, JSON.stringify(brand), {headers: headers})
      .map(res => res.json());
  }

  // Delete a brand
  deleteBrand(brand) {
    return this.http.delete('http://localhost:3000/brands/' + brand._id)
      .map(res => res.json());

  }



}
