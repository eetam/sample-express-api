import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ValidationException } from "../config/exception.config";

export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return next(new ValidationException(errorMessages.join(", ")));
    }
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return next(new ValidationException(errorMessages.join(", ")));
    }
    next();
  };
};
