import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  requestBody,
  response,
} from "inversify-express-utils";
import { Response } from "express";
import { CommandMediator } from "../cqrs-common/command.mediator";
import { validateBody } from "../validation/validation.middleware";
import { createOrderSchema } from "./validation/validation.schema";
import { AddOrderCommand } from "./services/command/add-order.command";
import { CreateOrderDto } from "./dtos/create-order.dto";
import {
  InsufficientStockException,
  ProductNotFoundException,
} from "../products/services/exceptions";
import {
  BadRequestException,
  NotFoundException,
} from "../config/exception.config";
import { CreateOrderResponseDto } from "./dtos/create-order-response.dto";

@controller("/orders")
export class OrdersController extends BaseHttpController {
  constructor(
    @inject(CommandMediator) private commandMediator: CommandMediator
  ) {
    super();
  }

  @httpPost("/", validateBody(createOrderSchema))
  async createProduct(
    @response() res: Response,
    @requestBody() dto: CreateOrderDto
  ) {
    try {
      const result = await this.commandMediator.execute<
        CreateOrderDto,
        CreateOrderResponseDto
      >(new AddOrderCommand(dto.customerId, dto.products));
      res.status(201); // created
      return result;
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
