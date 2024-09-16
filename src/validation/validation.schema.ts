import { JoiExtended as Joi } from "./joi.extension";

export const objectIdSchema = Joi.object({
  id: Joi.objectId().required(),
});
