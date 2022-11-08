import dayjs from 'dayjs';

export interface IUsers {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  birth?: string;
}

export const defaultValue: Readonly<IUsers> = {};
