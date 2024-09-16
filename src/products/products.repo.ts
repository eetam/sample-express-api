import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import {
  IProduct,
  IProductDoc,
  ProductModel,
  ProductSchema,
} from "./models/product";

@injectable()
export class ProductsRepository {
  constructor(
    @inject(ProductModel)
    private readonly productModel: Model<ProductSchema>
  ) {}

  async createProduct(product: IProduct): Promise<IProductDoc> {
    return await new this.productModel(product).save();
  }

  async getAllProducts(): Promise<IProductDoc[]> {
    return await this.productModel.find();
  }

  async getProductById(id: string): Promise<IProductDoc> {
    return await this.productModel.findById(id);
  }
}
