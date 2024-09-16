import { Prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Document, Model, SchemaOptions } from "mongoose";
import { BaseSchema } from "../../db/base.schema";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface IProductDoc extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const schemaOptions: SchemaOptions = {
  collection: "products",
  versionKey: false,
  toJSON: {
    transform: (_doc, _ret) => {
      // Customize the JSON output if needed
    },
  },
};

@modelOptions({ schemaOptions })
export class ProductSchema extends BaseSchema {
  @Prop({
    required: true,
    maxlength: 50,
  })
  public name: string;

  @Prop({
    required: true,
    maxlength: 50,
  })
  public description: string;

  @Prop({
    required: true,
    min: 0,
  })
  public price: number;

  @Prop({
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  })
  public stock: number;
}

export class ProductModel {
  public static model: Model<ProductSchema>;

  private constructor() {}

  public static getModel(): Model<ProductSchema> {
    if (!ProductModel.model) {
      ProductModel.model = getModelForClass(ProductSchema);
    }

    return ProductModel.model;
  }
}
