import { injectable } from "inversify";
import { RestockProductCommand } from "../restock-product.command";
import { ProductsRepository } from "../../../products.repo";
import { RestockProductResponseDto } from "../../../dtos/restock-product-response.dto";
import { ProductNotFoundException } from "../../exceptions";

@injectable()
export class RestockProductHandler {
  constructor(private readonly productsRepository: ProductsRepository) {}

  public async handle(
    command: RestockProductCommand
  ): Promise<RestockProductResponseDto> {
    const product = await this.productsRepository.getProductById(
      command.productId
    );
    if (!product) {
      throw new ProductNotFoundException(
        `Product with ID ${command.productId} not found`
      );
    }

    product.stock += command.additionalStock;
    await product.save();

    return { newStockLevel: product.stock };
  }
}
