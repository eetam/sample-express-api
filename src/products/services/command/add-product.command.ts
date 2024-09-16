export class AddProductCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly stock: number,
    public readonly price: number
  ) {}
}
