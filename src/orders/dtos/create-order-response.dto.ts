import { ProductToBuyDto } from "./base/product-to-buy.dto";

export class CreateOrderResponseDto {
  id: string;
  customerId: string;
  products: ProductToBuyDto[];
}
