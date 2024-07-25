export interface FetchNewProductsResponse {
  message: string;
  products: {
    _id: string;
    __v: number;
    productName: string;
    productCategory: string;
    productImages: string[];
    description: string;
    priceInPKR: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface SaveWishedProductResponse {
  message: string;
  wishedProduct: {
    user: string;
    product: string;
    _id: string;
    __v: number;
  };
}

export interface FetchWishedProductsResponse {
  message: string;
  wishedProducts: {
    _id: string;
    __v: string;
    user: string;
    product: string;
  }[];
}

export interface RemoveWishedProductRespone {
  message: string;
}
