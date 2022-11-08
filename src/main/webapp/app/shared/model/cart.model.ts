import { IUsers } from 'app/shared/model/users.model';
import { IMenu } from 'app/shared/model/menu.model';

export interface ICart {
  id?: number;
  quantity?: number;
  users?: IUsers;
  menu?: IMenu;
}

export const defaultValue: Readonly<ICart> = {};
