import { injectable, inject } from "inversify";
import { ProductsRepository } from "../../../products.repo";
import { GetProductsQuery } from "../get-products.query";
import { IProductDoc } from "../../../models/product";
import { GetAllProductResponsesDto } from "../../../dtos/get-all-products-response.dto";
import { ProductWithIdDto } from "../../../dtos/base/product-with-id.dto";

@injectable()
export class GetProductsHandler {
  constructor(
    @inject(ProductsRepository) private productRepository: ProductsRepository
  ) {}

  public async handle(
    _query: GetProductsQuery
  ): Promise<GetAllProductResponsesDto> {
    const products = await this.productRepository.getAllProducts();

    const result = new GetAllProductResponsesDto();
    result.products = products.map((product: IProductDoc): ProductWithIdDto => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      };
    });

    return result;
  }
}
