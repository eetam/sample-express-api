import { JoiExtended as Joi } from "../../validation/joi.extension";

export const createOrderSchema = Joi.object({
  customerId: Joi.objectId().required(),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.objectId().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .required(),
});
