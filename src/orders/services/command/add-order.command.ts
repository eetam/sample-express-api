export class AddOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly products: ProductToBuy[]
  ) {}
}

export class ProductToBuy {
  productId: string;
  quantity: number;
}
