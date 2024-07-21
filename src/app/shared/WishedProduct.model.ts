export interface WishedProduct {
  user: string;
  id: string;
  product: {
    id: string;
    productName: string;
    productCategory: string;
    productImages: string[];
    description: string;
    priceInPKR: number;
  };
}
