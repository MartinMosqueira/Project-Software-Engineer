import dayjs from 'dayjs';
import { ICompany } from 'app/shared/model/company.model';
import { IUsers } from 'app/shared/model/users.model';

export interface ICard {
  id?: number;
  number?: number;
  name?: string;
  expiration?: string;
  code?: number;
  dni?: number;
  company?: ICompany;
  users?: IUsers;
}

export const defaultValue: Readonly<ICard> = {};
