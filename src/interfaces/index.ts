export interface ObjectContainer {
  id?: number;
  timestamp: string;
  name: string;
  description: string;
  code: string
  url: string;
  price: number;
  stock: number;
}

export interface CartContainer {
  id?: number;
  timestamp: string;
  productos: Array<object>
  }