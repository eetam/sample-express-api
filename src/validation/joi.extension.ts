import Joi from "joi";
import mongoose from "mongoose";

const objectIdExtension = (joi: typeof Joi) => ({
  type: "objectId",
  base: joi.string(),
  messages: {
    "objectId.base": "{{#label}} should be a valid MongoDB ObjectId",
  },
  validate(value: string, helpers: Joi.CustomHelpers) {
    if (!mongoose.isValidObjectId(value)) {
      return { value, errors: helpers.error("objectId.base") };
    }
  },
});

export const JoiExtended = Joi.extend(objectIdExtension);
