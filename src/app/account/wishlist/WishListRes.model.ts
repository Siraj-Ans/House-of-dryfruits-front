export interface RemoveWishedProductRespone {
  message: string;
}

export interface FetchWishedProductsResponse {
  message: string;
  id: string;
  wishedProducts: {
    _id: string;
    __v: string;
    user: string;
    product: {
      _id: string;
      __v: number;
      productName: string;
      productCategory: string;
      productImages: string[];
      description: string;
      priceInPKR: number;
    };
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
