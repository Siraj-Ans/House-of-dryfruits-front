export interface FetchAccountDetails {
  message: string;
  accountDetails: {
    _id: string;
    __v: number;
    user: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    city: string;
    postalCode: number;
    address1: string;
    address2: string;
  } | null;
}

export interface FetchCheckedOutProducts {
  message: string;
  products: {
    _id: string;
    __v: number;
    productName: string;
    productCategory: string;
    productImages: string[];
    description: string;
    priceInPKR: number;
  }[];
}

export interface CreateOrderResponse {
  message: string;
  order: {
    _id: string;
    __v: number;
    user: string;
    emailAddress: string;
    country: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    city: string;
    postalCode: number;
    address1: string;
    paymentMethod: string;
    productInfo: {
      productName: string;
      quantity: number;
      productsTotal: number;
    }[];
    paid: boolean;
    fullfilled: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    address2?: string;
  };
}
