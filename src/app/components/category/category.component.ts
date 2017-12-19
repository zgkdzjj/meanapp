import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/primeng";
import {ICategory} from "../../models/Category";
import {CategoryService} from "../../services/category.service";
import {ConfirmationService} from "primeng/primeng";
import {Message} from "../../models/message";


class Category implements ICategory {
  constructor(public id?, public name?, public status?) {}
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  private items: MenuItem[];
  categories: ICategory[];
  cols: any[];
  status: any[];
  display: boolean;
  selectedCat: ICategory;
  newCat: boolean;
  cat: ICategory = new Category();
  msgs: Message[] = [];


  constructor(private catService: CategoryService,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.items = [
      {label: 'Home', url: 'http://localhost:4200/home'},
      {label: 'Category'}
      ];

    this.catService.getCat().subscribe(cat => {
      this.categories = cat.data;
      console.log('cat => ' + JSON.stringify(cat, null, 4));
    });

    this.cols = [
      {field: 'catName', header: 'Name'},
      {field: 'catStatus', header: 'Status'}
    ];
    this.status = [
      {label: 'Choose', value: null},
      {label: 'Available', value: 'Available'},
      {label: 'Unavailable', value: 'Unavailable'}
    ];
  }

  displayDialog() {
    this.newCat = true;
    this.cat = new Category();
    this.display = true;
  }

  save() {
    if(this.newCat) {
      this.catService.addCat(this.cat).subscribe(data => {
        console.log('data => ' + JSON.stringify(data, null, 4));
        this.catService.getCat().subscribe(cat => {
          this.categories = cat.data;
        });
      });

    } else {
      this.catService.updateCat(this.cat).subscribe(data => {
        console.log('data => ' + JSON.stringify(data, null, 4));
        this.catService.getCat().subscribe(cat => {
          this.categories = cat.data;
        })
      })
    }
    this.display = false;
  }

  onRowDblclick(event) {
    this.newCat = false;
    this.cat = this.cloneCat(event.data);
    this.display = true;

  }

  onEditClick(data) {
    this.newCat = false;
    this.cat = this.cloneCat(data);
    this.display = true;
  }

  onRemoveClick(data){
    this.newCat = false;
    this.cat = this.cloneCat(data);
    this.confirmationService.confirm({
      message: 'Do you want to delete the category ' + data.catName + '?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: ()=> {
        this.catService.deleteCat(data).subscribe(data => {
          console.log('deleting data => ' + JSON.stringify(data, null, 4));
          if (data.success) {
            this.msgs = [{severity:'success', summary:'Confirmed', detail:'You have accepted'}];
          } else {
            this.msgs = [{severity:'error', summary:'Error', detail:'Error when deleting this record'}];
          }
          this.catService.getCat().subscribe(cat => {
            this.categories = cat.data;
          })
        });

      },
      reject: ()=>{
        //this.msgDia = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    })

  }



  cloneCat(c : ICategory) {
    return Object.assign({}, c);
  }


}
