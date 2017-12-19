import { Injectable } from '@angular/core';
import { Http, Headers} from "@angular/http";
import { ICategory} from "../models/Category";

@Injectable()
export class CategoryService {
  cat: ICategory;

  constructor(private http: Http) { }

  //  Add Category
  addCat(cat) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/categories', cat, {headers: headers})
      .map(res => res.json());
  }

  // Get all categories from the database
  getCat() {
    return this.http.get('http://localhost:3000/categories', null)
      .map(res => res.json());
  }

  // Update a category
  updateCat(cat) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/categories/' + cat._id, JSON.stringify(cat), {headers: headers})
      .map(res => res.json());

  }

  // Delete a category
  deleteCat(cat) {
    return this.http.delete('http://localhost:3000/categories/' + cat._id)
      .map(res => res.json());
  }


}
