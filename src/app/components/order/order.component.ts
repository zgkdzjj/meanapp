import {Component, OnInit} from '@angular/core';
import {MenuItem, CalendarModule, SelectItem} from "primeng/primeng";
import {IOProduct} from "../../models/OProduct";
import {OrderService} from "../../services/order.service";
import {IOrder} from "../../models/Order";
import {ProductService} from "../../services/product.service";
import {Header} from 'primeng/primeng';
import {Footer} from 'primeng/primeng';
//import {MessageService} from "primeng/components/common/messageservice";
import {Message} from "primeng/primeng";
import {noUndefined} from "@angular/compiler/src/util";

class OProduct implements IOProduct {
  constructor(public name?, public rate?, public quantity?, public total?) {
  }
}

export class Order implements IOrder {
  constructor(public orderNb?,
              public orderDate?,
              public clientName?,
              public contactNb?,
              public address?,
              public products?,
              public subAmount?,
              public totalAmount?,
              public profit?,
              public discount?,
              public shipmentFee?,
              public grandTotal?,
              public paidAmount?,
              public dueAmount?,
              public paymentType?,
              public paymentStatus?,
              public orderStatus?,
              public trackNb?) {
  }
}


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  displayDialog: boolean;
  order: IOrder = new Order();
  //orders: IOrder[];
  oproduct: IOProduct = new OProduct();
  avblProducts: any[] = [];
  selectedProd: IOProduct;
  newProd: boolean;
  //oproducts: IOProduct[] = [];
  oproducts: IOProduct[] = [];

  paymentTypes: SelectItem[];
  paymentStatuses: SelectItem[];
  msgs: Message[] = [];
  date1: Date;


  private items: MenuItem[];

  constructor(private orderService: OrderService,
              private productService: ProductService) {
  }

  ngOnInit() {
    this.items = [
      {label: 'Home'},
      {label: 'Order'},
      {label: 'Add Order'}
    ];

    // Define Payment Types
    this.paymentTypes = [
      {label: 'Alipay', value: 'Alipay'},
      {label: 'Wechat', value: 'Wechat'},
      {label: 'Cash', value: 'Cash'},
      {label: 'Bank Deposit', value: 'Bank Deposit'},
      {label: 'Not Applicable', value: 'Not Applicable'},


    ];

    // Define Payment Status
    this.paymentStatuses = [
      {label: 'Full Payment', value: 'Full Payment'},
      {label: 'Advance Payment', value: 'Advance Payment'},
      {label: 'No Payment', value: 'No Payment'},
    ];

    // Get all orders
    /*this.orderService.getOrders().subscribe(orders => {
      this.orders = orders.data;
      console.log('orders => ' + JSON.stringify(orders, null, 4));
    });*/


    // Get all available products for puchase
    /*this.productService.getProd().subscribe(products => {
      console.log('products => ' + JSON.stringify(products, null, 4));


      // set available products dynamically
      for (var i in products.data) {
        if (products.data[i].prodStatus == 'Available') {
          if (products.data[i].prodSpecs == undefined) {
            var spec = '';

          } else {
            spec = ' - ' + products.data[i].prodSpecs;
          }
          this.avblProducts.push({
            "label": products.data[i].prodName + spec,
            //"value": {'name': products.data[i].prodName, 'rate' : products.data[i].prodRate},
            "value": products.data[i].prodName + spec,
            "rate": products.data[i].prodRate

          });

        }
      }
    });*/
    this.avblProducts = this.getAvblProducts();

  }

  // Get all available products
  getAvblProducts() : any[] {
    let p : any[] =[];
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
          p.push({
            "label": products.data[i].prodName + spec,
            //"value": {'name': products.data[i].prodName, 'rate' : products.data[i].prodRate},
            "value": products.data[i].prodName + spec,
            "rate": products.data[i].prodRate

          });

        }
      }
    });

    return p;
  }

  showDialogToAdd() {
    this.newProd = true;
    this.oproduct = new OProduct();
    this.displayDialog = true;
  }

  // Save Purchase List
  savePurList() {
    console.log('save button pressed.');
    if (this.oproduct.name == undefined || this.oproduct.rate == undefined || this.oproduct.quantity == undefined || this.oproduct.total == undefined) {
      console.log('something undefined');
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: 'Name and Quantity needed.'});

    } else {
      let ops = [...this.oproducts];
      if (this.newProd) {
        ops.push(this.oproduct);
      } else {
        ops[this.findSelectedOPIndex()] = this.oproduct;
      }
      this.oproducts = ops;
      this.oproduct = null;
      this.displayDialog = false;

      // update sub amount
      this.updateSub();
      this.updateTotal();
    }


    console.log('this.oproducts => ' + JSON.stringify(this.oproducts, null, 4));


  }

  //Delete Purchase List
  delPurList() {
    console.log('delete button pressed.');
    let index = this.findSelectedOPIndex();
    this.oproducts = this.oproducts.filter((val, i) => i != index);
    this.oproduct = null;
    this.displayDialog = false;

    // update sub amount
    this.updateSub();

    this.updateTotal();
  }

  // Update Sub Amount
  updateSub() {
    var sub = 0;
    for (var i in this.oproducts) {
      console.log('i => ' + this.oproducts[i].total);
      sub += this.oproducts[i].total;
    }
    this.order.subAmount = sub;
    this.order.paidAmount = 0;
  }

  onRowSelect(event) {
    this.newProd = false;
    this.oproduct = this.cloneProd(event.data);
    this.displayDialog = true;
    console.log('event => ' + JSON.stringify(event, null, 4));
  }

  cloneProd(p: IOProduct): IOProduct {
    let product = new OProduct();
    for (let prop in p) {
      console.log('prop => ' + JSON.stringify(prop, null, 4) + 'p => ' + JSON.stringify(p, null, 4));
      product[prop] = p[prop]
    }
    return product;
  }

  findSelectedOPIndex(): number {
    return this.oproducts.indexOf(this.selectedProd);

  }

  onChange(event) {
    this.oproduct.quantity = null;
    this.oproduct.total = null;

    console.log('event => ' + JSON.stringify(event, null, 4));
    this.oproduct.rate = this.avblProducts.find(function isSelect(select) {
      return select.value === event.value;
    }).rate;

    console.log(this.avblProducts.find(function isSelect(select) {
        return select.value === event.value;
      }
    ));
  }

  quantityKeyup() {
    console.log('quantity key up');
    this.oproduct.total = this.oproduct.rate * this.oproduct.quantity;
  }

  updateTotal() {
    let gt = 0;
    this.order.paidAmount = 0;

    if (this.order.subAmount == undefined) {
      this.order.subAmount = 0;
    }
    if (this.order.shipmentFee == undefined) {
      this.order.shipmentFee = 0;
    }
    if (this.order.profit == undefined) {
      this.order.profit = 0;
    }
    if (this.order.discount == undefined) {
      this.order.discount = 0;
    }

    console.log('subAmount => ' + this.order.subAmount);
    console.log('shipmentFee => ' + this.order.shipmentFee);
    console.log('profit => ' + this.order.profit);
    console.log('discount => ' + this.order.discount);
    gt = (this.order.subAmount + this.order.shipmentFee) * (1 + this.order.profit) - this.order.discount;
    this.order.grandTotal = gt;
    this.order.dueAmount = this.order.grandTotal - this.order.paidAmount;
    console.log('grandTotal => ' + this.order.grandTotal);


  }

  // Calculate Due Amount
  calDue() {
    if (this.order.paidAmount == undefined) {
      this.order.paidAmount = 0;
    }

    this.order.dueAmount = this.order.grandTotal - this.order.paidAmount;
  }

  // Save Order to db
  saveOrder() {
    console.log('save order button pressed');

    if (this.order.clientName == undefined || this.order.contactNb == undefined || this.order.orderDate == undefined || this.oproducts.length == 0) {
      this.msgs = [];
      this.msgs.push({severity: 'warn', detail: 'Order details needed.'});
    } else {
      // generate order nuber
      this.order.orderNb = (Math.floor(Math.random() * 1000000)).toString();
      // add products list
      this.order.products = this.oproducts;
      console.log('this.order 21=> ' + JSON.stringify(this.order, null, 4));
      this.orderService.addOrder(this.order).subscribe(data => {
        console.log(data);
        if (data.success) {
          this.msgs.push({severity: 'success', summary: 'Service Message', detail: 'Order added successfully.'});
          this.resetOrder();
        } else {
          this.msgs.push({severity: 'error', summary: 'Service Message', detail: 'Failed to add order.'});
        }
      });
    }

    /*
        console.log('this.order => ' + JSON.stringify(this.order, null, 4));
    */
  }

  // Reset Order
  resetOrder() {
    console.log('resent order button pressed');
    this.order.clientName = null;
    this.order.contactNb = null;
    this.order.orderDate = null;
    this.order.address = null;
    this.order.trackNb = null;
    this.oproducts = [];
    this.updateSub();
    this.updateTotal();
  }

  // onSelect Date
  onSelectDate() {
    console.log('order.orderDate => ' + this.order.orderDate);
  }


}
