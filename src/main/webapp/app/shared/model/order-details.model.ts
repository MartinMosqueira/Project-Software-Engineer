import { IOrders } from 'app/shared/model/orders.model';
import { IMenu } from 'app/shared/model/menu.model';

export interface IOrderDetails {
  id?: number;
  quantity?: number;
  price?: number;
  orders?: IOrders;
  menu?: IMenu;
}

export const defaultValue: Readonly<IOrderDetails> = {};
