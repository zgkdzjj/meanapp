import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem, Message, FileUpload, FileUploadModule, ConfirmationService, OverlayPanel} from "primeng/primeng";
import {IProduct} from "../../models/Product";
import {ProductService} from "../../services/product.service";
import {BrandService} from "../../services/brand.service";
import {CategoryService} from "../../services/category.service";
import {ValidateService} from "../../services/validate.service";
import {DomSanitizer} from '@angular/platform-browser';


class Product implements IProduct {
  constructor(public id?,
              public prodImgName?,
              public prodName?,
              public prodBrand?,
              public prodCat?,
              public prodQuantity?,
              public prodRate?,
              public prodStatus?,
              public prodImg?,
              public prodSpecs?) {
  }
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private items: MenuItem[];
  @ViewChild('fileInput') fileInput: FileUpload;
  @ViewChild('imgRef') img: ElementRef;
  formData: FormData = new FormData();
  products: IProduct[];
  cols: any[];
  avatar: any;

  status: any[];
  avblBrands: any[] = [];
  avblCat: any[] = [];
  display: boolean;
  displayImg: boolean;
  formValidation: boolean;
  selectedProd: IProduct;
  newProd: boolean;
  prod: IProduct = new Product();

  msg: Message[] = [];
  imgMsg: Message[] = [];
  imgBin: any;
  imgSrc: any;

  constructor(private prodService: ProductService,
              private brandService: BrandService,
              private catService: CategoryService,
              private confirmationService: ConfirmationService,
              private validateService: ValidateService,
              private sanitizer: DomSanitizer) {

  }


  ngOnInit() {
    this.items = [
      {label: 'Home', url: 'http://localhost:4200/home'},
      {label: 'Products'}
    ];
    this.prodService.getProd().subscribe(prod => {
      this.products = prod.data;
      //this.imgBin = this.products;
      //this.img.nativeElement.scr = 'data:image/png;base64,' + prod.data.prodImg.data;
      console.log('this.prod => ' + JSON.stringify(this.products, null, 4));
      //console.log('this.imgBin => ' + JSON.stringify(this.imgBin, null, 4));
    });
    this.cols = [
      {field: 'prodImg', header: 'Image'},
      {field: 'prodName', header: 'Name'},
      {field: 'prodBrand', header: 'Brand'},
      {field: 'prodCat', header: 'Category'},
      {field: 'prodQuantity', header: 'Quantity'},
      {field: 'prodRate', header: 'Rate'},
      {field: 'prodStatus', header: 'Status'},
      {field: 'prodSpecs', header: 'Specs'}
    ];
    this.status = [
      {label: 'Choose', value: null},
      {label: 'Available', value: 'Available'},
      {label: 'Unavailable', value: 'Unavailable'}
    ];

    // Get all available brands from the db
    this.brandService.getBrand().subscribe(brand => {
      //console.log('brand => ' + JSON.stringify(brand, null, 4));

      // set available brands dynamically
      for (var i in brand.data) {
        if (brand.data[i].brandStatus == 'Available') {
          this.avblBrands.push({
            "label": brand.data[i].brandName,
            "value": brand.data[i].brandName
          });
        }
      }
    });

    // Get all available categories from the db
    this.catService.getCat().subscribe(cat => {
      //console.log('cat => ' + JSON.stringify(cat, null, 4));
      // set available categories dynamically
      for (var i in cat.data) {
        if (cat.data[i].catStatus == 'Available') {
          this.avblCat.push({
            "label": cat.data[i].catName,
            "value": cat.data[i].catName
          });
        }
      }


    })

  }

  showImg(event, img, overlaypanel: OverlayPanel) {
    console.log('show image => ' + JSON.stringify(img, null, 4));
    console.log('img.prodImgName =>' + img.prodImgName);
    //overlaypanel.toggle(event);
    if (img.prodImgName == undefined) {
      this.displayImg = false;
      this.msg = [];
      this.msg.push({severity: 'info', summary: 'Info Message', detail: 'No image uploaded'});
      //res.json({success: false, msg: ' This product has not image, please add '})
      console.log('img.prodImgName undefined');
    } else {
      this.displayImg = true;
      this.prodService.getImage(img.prodImgName).subscribe(image => {
        //this.imgBin = image.data.data;
        var src = 'data:image/png;base64,' + image.data.data;
        this.imgSrc = this.sanitizer.bypassSecurityTrustUrl(src);
        //overlaypanel.toggle(event);
      });
    }

    overlaypanel.toggle(event);

  }


  displayDialog() {
    //this.formData.delete('avatar');
    this.fileInput.clear();

    this.newProd = true;
    this.prod = new Product();
    this.display = true;
  }

  onSelect(event) {
    console.log('event => ' + JSON.stringify(event.files[0], null, 4));
    this.formData.set('avatar', event.files[0]);
  }

  save() {

    console.log('this.prod => ' + JSON.stringify(this.prod, null, 4));
    if (this.validateService.validateProdForm(this.prod)) {
      console.log('validate passed');

      //console.log('fileInput => ' + JSON.stringify(input,null,4));
      this.formData.set('prodName', this.prod.prodName);
      this.formData.set('prodBrand', this.prod.prodBrand);
      this.formData.set('prodCat', this.prod.prodCat);
      this.formData.set('prodQuantity', this.prod.prodQuantity.toString());
      this.formData.set('prodRate', this.prod.prodRate.toString());
      this.formData.set('prodStatus', this.prod.prodStatus);
      this.formData.set('prodSpecs', this.prod.prodSpecs);

      //this.fileInput.upload();
      console.log('this.formData => ' + this.formData);
      console.log('avatar => ' + JSON.stringify(this.formData.getAll('avatar'), null, 4));

      if (this.newProd) {
        //console.log('this.formData => ' + JSON.stringify(this.formData, null, 4));
        console.log('this.formData.avatar =>' + this.formData.getAll('avatar'));

        this.prodService.addProd(this.formData).subscribe(data => {
          console.log('data => 111 ' + JSON.stringify(data, null, 4));
          this.prodService.getProd().subscribe(products => {
            this.products = products.data;
          });
        });
      } else {
        this.formData.set('_id', this.prod._id);
        console.log('this.formData._id => ' + JSON.stringify(this.formData.getAll('_id'), null, 4));
        console.log('updated avatar => ' + JSON.stringify(this.formData.getAll('avatar'), null, 4));

        //console.log('this.formData.avatar => ' + this.formData.getAll('avatar'));

        console.log('update this.formData else =>' + this.formData);
        this.prodService.updateProd(this.formData).subscribe(data => {
          this.prodService.getProd().subscribe(products => {
            this.products = products.data
          });
        });

      }
      this.display = false;
    } else {
      this.formValidation = true;
    }
    this.formData.delete('avatar');

  }

  onEditClick(rowData) {
    this.newProd = false;
    this.prod = this.cloneProd(rowData);
    this.display = true;
    console.log('rowData => ' + JSON.stringify(rowData, null, 4));
  }

  onRemoveClick(data) {
    this.newProd = false;
    this.prod = this.cloneProd(data);
    this.confirmationService.confirm({
      message: 'Do you want to delete the product ' + data.prodName + '?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.prodService.deleteProd(data).subscribe(data => {
          console.log('deleting data => ' + JSON.stringify(data, null, 4));
          if (data.success) {
            this.msg = [{severity: 'success', summary: 'Confirmed', detail: 'The product has benn removed.'}];
          } else {
            this.msg = [{severity: 'error', summary: 'Error', detail: 'Error when deleting this record'}];
          }
          this.prodService.getProd().subscribe(products => {
            this.products = products.data;
          })
        });

      },
      reject: () => {
        //this.msgDia = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    })

  }

  onRowDblclick(event) {
    this.fileInput.clear();
    this.newProd = false;
    this.prod = this.cloneProd(event.data);
    console.log('this.prod => ' + JSON.stringify(this.prod, null, 4));
    this.display = true;
  }

  cloneProd(p: IProduct) {
    return Object.assign({}, p);
  }

}
