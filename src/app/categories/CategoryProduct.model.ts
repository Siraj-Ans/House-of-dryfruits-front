import { Category } from './category.model';

export interface CategoryProduct {
  category: Category;
  categoriesProducts: {
    id: string;
    productName: string;
    productCategory: {
      id: string;
      categoryName: string;
      properties: { property: string; values: string[] }[];
    };
    productImages: string[];
    description: string;
    priceInPKR: number;
  }[];
}
