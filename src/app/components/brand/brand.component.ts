import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {MatCard} from "@angular/material";
//import {AddBrandDialogComponent} from "../dialogs/add-brand-dialog/add-brand-dialog.component";
import {DataTableModule, SharedModule} from "primeng/primeng";
import {BrandService} from "../../services/brand.service";
import {IBrand} from "../../models/Brand";
import {ConfirmationService} from "primeng/primeng";
import {Message} from 'primeng/primeng';

class PrimeBrand implements IBrand {
  constructor(public id?, public name?, public status?) {
  }
}

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  location: String;
  //brandName: String;
  //brandStatus: String;
  brands: IBrand[];
  cols: any[];

  status: any[];

  display: boolean;

  nameNeeded: boolean = false;
  selectedBrand: IBrand;
  newBrand: boolean;

  brand: IBrand = new PrimeBrand();


  msg: any;

  msgDia: Message[] = [];

  constructor(private router: Router,
              private brandService: BrandService,
              private confirmationService: ConfirmationService) {
    this.location = router.url.substring(1);
  }

  ngOnInit() {
    this.brandService.getBrand().subscribe(brands => {
      this.brands = brands.data;
      console.log('brands =>' + JSON.stringify(this.brands, null, 4))
    });
    this.cols = [
      {field: 'brandName', header: 'Name'},
      {field: 'brandStatus', header: 'Status'}
    ];
    this.status = [
      {label: 'Choose', value: null},
      {label: 'Available', value: 'Available'},
      {label: 'Unavailable', value: 'Unavailable'}
    ]
  }

  displayDialog() {
    console.log('press display dialog');
    this.newBrand = true;
    this.brand = new PrimeBrand();
    //this.brand = null;
    this.display = true;
    this.nameNeeded = false;
  }

  save() {

      if (this.newBrand) {
        console.log(this.newBrand + ' this.brand=>' + JSON.stringify(this.brand, null, 4));
        //this.brands.push(this.brand);

        this.brandService.addBrand(this.brand).subscribe(data => {
          this.msg = data;
          console.log('this.msg =>1 ' + JSON.stringify(this.msg, null, 4));
          this.brandService.getBrand().subscribe(brands => {
            this.brands = brands.data
          });
        });

      } else {
        console.log('this.brand=>' + JSON.stringify(this.brand, null, 4));
        //this.brands[this.findSelectedBrandIndex()] = this.brand;
        this.brandService.updateBrand(this.brand).subscribe(data => {
          this.msg = data;
          this.brandService.getBrand().subscribe(brands => {
            this.brands = brands.data
          })
        });
      }
      console.log('this.brands=> ' + JSON.stringify(this.brands, null, 4));

      //this.brand = null;
      this.display = false;

  }


  onRowDblclick(event) {
    console.log('event=>' + JSON.stringify(event, null, 4));
    this.newBrand = false;
    this.brand = this.cloneBrand(event.data);
    //this.brand = new PrimeBrand(event.data._id, event.data.brandName, event.data.brandStatus);
    console.log('row dbl click this.brand=>' + JSON.stringify(this.brand,null, 4));
    this.display = true;
  }

  onEditClick(event) {
    console.log('onEditClick');
    this.newBrand = false;
    this.brand = this.cloneBrand(event);
    this.display = true;
  }

  onRemoveClick(brand) {
    console.log('onRemoveClick' + 'deleting brand =>  ' +  JSON.stringify(brand, null, 4));
    this.confirmationService.confirm({
      message: 'Do you want to delete the brand ' + brand.brandName + '?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: ()=> {
        this.brandService.deleteBrand(brand).subscribe(data => {
          console.log('deleting data => ' + JSON.stringify(data, null, 4));
          if (data.success) {
            this.msgDia = [{severity:'success', summary:'Confirmed', detail:'You have accepted'}];
          } else {
            this.msgDia = [{severity:'error', summary:'Error', detail:'Error when deleting this record'}];
          }
          this.brandService.getBrand().subscribe(brands => {
            this.brands = brands.data;
          })
        });

      },
      reject: ()=>{
        //this.msgDia = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    })

  }


  cloneBrand(b: IBrand): IBrand {
    return Object.assign({}, b);
  }

  findSelectedBrandIndex(): number {
    return this.brands.indexOf(this.selectedBrand);
  }

}



