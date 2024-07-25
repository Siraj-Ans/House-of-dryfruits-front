export interface FetchProductResponse {
  message: string;
  product: {
    _id: string;
    __v: number;
    productName: string;
    productCategory: string;
    productImages: string[];
    description: string;
    priceInPKR: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SaveReviewResponse {
  message: string;
  review: {
    _id: string;
    title: string;
    comment: string;
    stars: number;
    productId: string;
  };
}

export interface FetchReviewsResponse {
  message: string;
  reviews: {
    _id: string;
    title: string;
    comment: string;
    stars: number;
    productId: string;
    createdAt: string;
    updatedAt: string;
  }[];
}
