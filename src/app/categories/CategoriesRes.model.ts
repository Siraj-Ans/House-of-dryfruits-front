export interface FetchCategoriesResponse {
  message: string;
  categories: {
    _id: string;
    __v: number;
    categoryName: string;
    parent?: {
      _id: string;
      categoryName: string;
      properties: { property: string; values: string[] }[];
    };
    properties: { property: string; values: string[] }[];
  }[];
}

export interface FetchCategoriesProductsResponse {
  message: string;
  categoriesProducts: {
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
