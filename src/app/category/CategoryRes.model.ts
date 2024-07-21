export interface FetchCategoryProductsResponse {
  message: string;
  categoryProducts: {
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

export interface FetchCategoryResponse {
  message: string;
  category: {
    _id: string;
    __v: number;
    categoryName: string;
    parent?: {
      _id: string;
      categoryName: string;
      properties: { property: string; values: string[] }[];
    };
    properties: { property: string; values: string[] }[];
  };
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
