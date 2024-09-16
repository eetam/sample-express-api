import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { IOrder, IOrderDoc, OrderModel, OrderSchema } from "./models/order";

@injectable()
export class OrdersRepository {
  constructor(
    @inject(OrderModel)
    private readonly orderModel: Model<OrderSchema>
  ) {}

  async createOrder(order: IOrder): Promise<IOrderDoc> {
    return await new this.orderModel(order).save();
  }
}
