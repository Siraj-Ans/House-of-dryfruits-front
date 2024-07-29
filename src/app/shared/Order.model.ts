export class Order {
  constructor(
    public user: string,
    public emailAddress: string,
    public country: string,
    public phoneNumber: string,
    public firstName: string,
    public lastName: string,
    public city: string,
    public postalCode: number,
    public address1: string,
    public paymentMethod: string,
    public productInfo: {
      productName: string;
      quantity: number;
      productsTotal: number;
    }[],
    public paid: boolean,
    public fullfilled: string,
    public completed: boolean,
    public address2?: string
  ) {}
}
