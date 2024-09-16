export class SellProductCommand {
  constructor(
    public readonly productId: string,
    public readonly quantity: number
  ) {}
}
