import { ProductToBuyDto } from "./base/product-to-buy.dto";

export class CreateOrderDto {
  customerId: string;
  products: ProductToBuyDto[];
}
