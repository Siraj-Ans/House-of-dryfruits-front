export interface FetchCartItemProducts {
  message: string;
  products: {
    _id: string;
    __v: number;
    productName: string;
    productCategory: {
      _id: string;
      __v: number;
      categoryName: string;
      properties: { property: string; values: string[] }[];
    };
    productImages: string[];
    description: string;
    priceInPKR: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface FetchShippingFee {
  message: string;
  shippingFee: number;
}
