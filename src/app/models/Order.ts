import {IOProduct} from "./OProduct";

export interface IOrder {
  orderNb?: string;
  orderDate?: string;
  clientName?: string;
  contactNb?: number;
  address?: string;
  products?: IOProduct[];
  subAmount?: number;
  totalAmount?: number;
  profit?: number;
  discount?: number;
  shipmentFee?: number;
  grandTotal?: number;
  paidAmount?: number;
  dueAmount?: number;
  paymentType?: string;
  paymentStatus?: string;
  orderStatus?: string;
  trackNb?: string;
}
