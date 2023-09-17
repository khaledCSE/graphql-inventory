export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
}

export interface ProductListData {
  products: Product[];
  products_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface ProductDataType {
  key: number;
  index: number;
  name: string;
  price: number;
  stock: number;
  description: string;
}