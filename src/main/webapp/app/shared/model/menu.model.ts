export interface IMenu {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}

export const defaultValue: Readonly<IMenu> = {};
