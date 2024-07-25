export class Product {
  constructor(
    public id: string,
    public productName: string,
    public productCategory: string,
    public productImages: string[],
    public description: string,
    public priceInPKR: number
  ) {}
}
