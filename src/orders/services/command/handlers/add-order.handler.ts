import { injectable, inject } from "inversify";
import { OrdersRepository } from "../../../orders.repo";
import { CreateOrderResponseDto } from "../../../dtos/create-order-response.dto";
import { AddOrderCommand } from "../add-order.command";
import { ProductsRepository } from "../../../../products/products.repo";
import {
  InsufficientStockException,
  ProductNotFoundException,
} from "../../../../products/services/exceptions";
import { Types } from "mongoose";

@injectable()
export class AddOrderHandler {
  constructor(
    @inject(OrdersRepository) private ordersRepository: OrdersRepository,
    @inject(ProductsRepository) private productsRepository: ProductsRepository
  ) {}

  public async handle(
    command: AddOrderCommand
  ): Promise<CreateOrderResponseDto> {
    // TODO: This is good place to use session and save all data within single transaction
    for (const product of command.products) {
      const retrievedProduct = await this.productsRepository.getProductById(
        product.productId
      );

      if (!retrievedProduct) {
        throw new ProductNotFoundException(
          `Product with ID ${product.productId} not found`
        );
      }

      if (retrievedProduct.stock < product.quantity) {
        throw new InsufficientStockException(
          `Insufficient stock for product ID ${product.productId}`
        );
      }

      retrievedProduct.stock -= product.quantity;
      await retrievedProduct.save();
    }

    const order = await this.ordersRepository.createOrder({
      customerId: command.customerId,
      products: command.products.map((product) => ({
        productId: new Types.ObjectId(product.productId),
        quantity: product.quantity,
      })),
    });

    return {
      id: order._id,
      customerId: order.customerId,
      products: order.products.map((product) => ({
        productId: product.productId.toString(),
        quantity: product.quantity,
      })),
    };
  }
}
