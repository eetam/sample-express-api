import { Prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Document, Model, SchemaOptions, Types } from "mongoose";
import { BaseSchema } from "../../db/base.schema";

export interface IOrder {
  customerId: string;
  products: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
}

export interface IOrderDoc extends Document {
  _id: string;
  customerId: string;
  products: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
}

const schemaOptions: SchemaOptions = {
  collection: "orders",
  versionKey: false,
  toJSON: {
    transform: (_doc, _ret) => {
      // Customize the JSON output if needed
    },
  },
};

class ProductItem {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Product", // Assuming the products are from the Product collection
  })
  public productId: Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
  })
  public quantity: number;
}

@modelOptions({ schemaOptions })
export class OrderSchema extends BaseSchema {
  @Prop({
    required: true,
    type: String,
  })
  public customerId: string;

  @Prop({
    required: true,
    type: [ProductItem],
    _id: false, // Disable automatic generation of _id for subdocuments
  })
  public products: ProductItem[];
}

export class OrderModel {
  public static model: Model<OrderSchema>;

  private constructor() {}

  public static getModel(): Model<OrderSchema> {
    if (!OrderModel.model) {
      OrderModel.model = getModelForClass(OrderSchema);
    }

    return OrderModel.model;
  }
}
