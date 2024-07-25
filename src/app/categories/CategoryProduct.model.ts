import { Category } from './category.model';

export interface CategoryProduct {
  category: Category;
  categoriesProducts: {
    id: string;
    productName: string;
    productCategory: string;
    productImages: string[];
    description: string;
    priceInPKR: number;
  }[];
}
