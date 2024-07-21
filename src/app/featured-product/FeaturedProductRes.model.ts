export interface FetchFeaturedProduct {
  message: string;
  featuredProduct: {
    _id: string;
    __v: number;
    productName: string;
    productCategory: string;
    productImages: string[];
    description: string;
    priceInPKR: number;
  };
}
