import { injectable } from "inversify";
import { ProductsRepository } from "../../../products.repo";
import { SellProductCommand } from "../sell-product.command";
import { SellProductResponseDto } from "../../../dtos/sell-product-response.dto";
import {
  InsufficientStockException,
  ProductNotFoundException,
} from "../../exceptions";

@injectable()
export class SellProductHandler {
  constructor(private readonly productsRepository: ProductsRepository) {}

  public async handle(
    command: SellProductCommand
  ): Promise<SellProductResponseDto> {
    const product = await this.productsRepository.getProductById(
      command.productId
    );
    if (!product) {
      throw new ProductNotFoundException(
        `Product with ID ${command.productId} not found`
      );
    }

    if (product.stock < command.quantity) {
      throw new InsufficientStockException("Insufficient product stock");
    }

    product.stock -= command.quantity;
    await product.save();

    return { quantityLeft: product.stock };
  }
}
