import { Component, OnInit } from '@angular/core';
import {OrderService} from "../../services/order.service";
import {IOrder} from "../../models/Order";
import {MenuItem, SelectItem} from "primeng/primeng";
import {Order} from "../order/order.component";
import {ProductService} from "../../services/product.service";
import {IOProduct} from "../../models/OProduct";


@Component({
  selector: 'app-manageorder',
  templateUrl: './manageorder.component.html',
  styleUrls: ['./manageorder.component.css']
})
export class ManageorderComponent implements OnInit {

  orders: IOrder[];
  order: IOrder;
  displayDialog: boolean;
  products: any[] = [];
  prodSelection: any[] = [];
  selectedProd: IOProduct;

  private items: MenuItem[];
  private orderStatus: SelectItem[];
  constructor(private orderService: OrderService,
              private productService: ProductService) { }

  ngOnInit() {
    this.items = [
      {label: 'Home'},
      {label: 'Order'},
      {label: 'Manage Order'}
    ];

    this.orderStatus = [
      {label: 'Processing', value: 'Processing'},
      {label: 'Ready to go', value: 'Ready to go'},
      {label: 'Shipped', value: 'Shipped'},
      {label: 'Delivered', value: 'Delivered'}
    ];


    // Get all available products for puchase
    this.productService.getProd().subscribe(products => {
      console.log('products => ' + JSON.stringify(products, null, 4));


      // set available products dynamically
      for (var i in products.data) {
        if (products.data[i].prodStatus == 'Available') {
          if (products.data[i].prodSpecs == undefined) {
            var spec = '';

          } else {
            spec = ' - ' + products.data[i].prodSpecs;
          }
          this.prodSelection.push({
            "label": products.data[i].prodName + spec,
            //"value": {'name': products.data[i].prodName, 'rate' : products.data[i].prodRate},
            "value": products.data[i].prodName + spec,
            "rate": products.data[i].prodRate
          });

        }
      }
    });

    // Get orders from the db
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders.data;
      console.log('this orders 11=> ' + JSON.stringify(this.orders, null, 4));
    });

    //console.log('this orders => ' + JSON.stringify(this.orders, null, 4));
  }

  // onEditClick event
  onEditClick(row) {
    console.log('Edit Button Clicked');
    console.log('row => ' + JSON.stringify(row, null, 4));
    this.order = row;
    this.displayDialog = true;

    console.log('this.order => ' + JSON.stringify(this.order, null, 4));

  }

  onEditQuantity(event){
    console.log('Table value changed');
    console.log('event => ' + JSON.stringify(event, null, 4));
    //console.log('row => ' + JSON.stringify(row, null, 4));

    // update item total

    event.data.total = event.data.rate * event.data.quantity;

    // update sub total
    var sub = 0;
    for (var i in this.order.products) {
      console.log('i => ' + this.order.products[i]);
      sub += this.order.products[i].total;
    }
    this.order.subAmount = sub;

  }

  // Add Item Click
  addItem() {
    console.log('add item button pressed');
    //this.order.products = [...this.order.products, {name: 'test', rate: 20}];
    this.order.products = [...this.order.products, {}];


  }

  onChange(event, prod, col) {
    console.log('event => ' + JSON.stringify(event, null, 4));
    console.log('prod => ' + JSON.stringify(prod, null, 4));
    //console.log('index => ' + JSON.stringify(col, null, 4));

    prod.rate = this.prodSelection.find(function isSelect(select) {
      return select.value === event.value;
    }).rate;
    //this.order.products = [...this.order.products, {name: event.value, rate: 20}];


  }


  // Update Order
  updateOrder() {
    console.log('update order pressed');
    console.log('this updated order => ' + JSON.stringify(this.order, null, 4));
  }

  onRemoveClick(row ,i ) {
    console.log('row => ' + JSON.stringify(row, null, 4));
    console.log('index => ' + i);
    this.order.products.splice(i, 1);
  }

}
