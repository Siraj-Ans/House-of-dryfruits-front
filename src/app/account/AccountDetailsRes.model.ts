export interface SaveAccountDetails {
  message: string;
  accountDetails: {
    userId: string;
    _id: string;
    __v: number;
    emailAddress: string;
    phoneNumber: string;
    city: string;
    postalCode: number;
    address1: string;
    address2: string;
  };
}

export interface FetchAccountDetails {
  message: string;
  accountDetails: {
    _id: string;
    __v: number;
    userId: string;
    emailAddress: string;
    phoneNumber: string;
    city: string;
    postalCode: number;
    address1: string;
    address2: string;
  };
}

export interface UpdateAccountDetailsResponse {
  message: string;
}
