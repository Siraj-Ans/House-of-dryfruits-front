export class AccountDetails {
  constructor(
    public userId: string,
    public emailAddress: string,
    public phoneNumber: string,
    public city: string,
    public postalCode: number,
    public address1: string,
    public address2: string,
    public id?: string
  ) {}
}
