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
