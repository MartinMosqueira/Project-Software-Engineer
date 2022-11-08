import dayjs from 'dayjs';
import { IPayment } from 'app/shared/model/payment.model';
import { IUsers } from 'app/shared/model/users.model';
import { ICard } from 'app/shared/model/card.model';

export interface IOrders {
  id?: number;
  date?: string;
  time?: string;
  total?: number;
  payment?: IPayment;
  users?: IUsers;
  card?: ICard | null;
}

export const defaultValue: Readonly<IOrders> = {};
