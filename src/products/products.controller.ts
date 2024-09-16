import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  requestBody,
  response,
  requestParam,
} from "inversify-express-utils";
import { Response } from "express";
import { CreateProductDto } from "./dtos/create-product-dto";
import { GetProductsQuery } from "./services/query/get-products.query";
import { AddProductCommand } from "./services/command/add-product.command";
import { RestockProductDto } from "./dtos/restock-product-dto";
import { RestockProductCommand } from "./services/command/restock-product.command";
import { RestockProductResponseDto } from "./dtos/restock-product-response.dto";
import { SellProductResponseDto } from "./dtos/sell-product-response.dto";
import { SellProductDto } from "./dtos/sell-product-dto";
import { SellProductCommand } from "./services/command/sell-product.command";
import {
  BadRequestException,
  NotFoundException,
} from "../config/exception.config";
import {
  InsufficientStockException,
  ProductNotFoundException,
} from "./services/exceptions";
import {
  validateBody,
  validateParams,
} from "../validation/validation.middleware";
import {
  createProductSchema,
  restockProductSchema,
  sellProductSchema,
} from "./validation/validation.schema";
import { objectIdSchema } from "../validation/validation.schema";
import { CommandMediator } from "../cqrs-common/command.mediator";
import { QueryMediator } from "../cqrs-common/query.mediator";
import { GetAllProductResponsesDto } from "./dtos/get-all-products-response.dto";
import { CreateProductResponseDto } from "./dtos/create-product-response.dto copy";

@controller("/products")
export class ProductsController extends BaseHttpController {
  constructor(
    @inject(CommandMediator) private commandMediator: CommandMediator,
    @inject(QueryMediator) private queryMediator: QueryMediator
  ) {
    super();
  }

  @httpGet("/")
  async getAllProducts() {
    return await this.queryMediator.execute<
      GetProductsQuery,
      GetAllProductResponsesDto
    >(new GetProductsQuery());
  }

  @httpPost("/", validateBody(createProductSchema))
  async createProduct(
    @response() res: Response,
    @requestBody() dto: CreateProductDto
  ) {
    const result = await this.commandMediator.execute<
      AddProductCommand,
      CreateProductResponseDto
    >(new AddProductCommand(dto.name, dto.description, dto.stock, dto.price));
    res.status(201); // created
    return result;
  }

  @httpPost(
    "/:id/restock",
    validateParams(objectIdSchema),
    validateBody(restockProductSchema)
  )
  async restockProduct(
    @requestParam("id") id: string,
    @requestBody() dto: RestockProductDto
  ) {
    try {
      return await this.commandMediator.execute<
        RestockProductCommand,
        RestockProductResponseDto
      >(new RestockProductCommand(id, dto.additionalStock));
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @httpPost(
    "/:id/sell",
    validateParams(objectIdSchema),
    validateBody(sellProductSchema)
  )
  async sellProduct(
    @requestParam("id") id: string,
    @requestBody() dto: SellProductDto
  ) {
    try {
      return await this.commandMediator.execute<
        SellProductCommand,
        SellProductResponseDto
      >(new SellProductCommand(id, dto.quantity));
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InsufficientStockException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
