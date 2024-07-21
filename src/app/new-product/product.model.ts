export class Product {
  constructor(
    public id: string,
    public productName: string,
    public productCategory:
      | {
          id: string;
          categoryName: string;
          properties: { property: string; values: string[] }[];
        }
      | string,
    public productImages: string[],
    public description: string,
    public priceInPKR: number
  ) {}
}
