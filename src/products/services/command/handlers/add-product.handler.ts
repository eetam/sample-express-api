import { injectable, inject } from "inversify";
import { AddProductCommand } from "../add-product.command";
import { ProductsRepository } from "../../../products.repo";
import { CreateProductResponseDto } from "../../../dtos/create-product-response.dto copy";

@injectable()
export class AddProductHandler {
  constructor(
    @inject(ProductsRepository) private productRepository: ProductsRepository
  ) {}

  public async handle(
    command: AddProductCommand
  ): Promise<CreateProductResponseDto> {
    const product = await this.productRepository.createProduct(command);

    return {
      id: product._id,
      name: product.name,
      description: product.description,
      stock: product.stock,
      price: product.price,
    };
  }
}
