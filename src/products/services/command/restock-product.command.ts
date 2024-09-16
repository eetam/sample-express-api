export class RestockProductCommand {
  constructor(
    public readonly productId: string,
    public readonly additionalStock: number
  ) {}
}
