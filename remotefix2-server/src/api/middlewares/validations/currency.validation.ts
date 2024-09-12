import { Request, Response, NextFunction } from "express";
import * as status from "http-status";
import { isValidObjectId } from "mongoose";
import { ValidationError } from "../../../utils/types/common";
import { filterObject } from "../../../utils/functions/utilities";


export const validateCurrencyAdd = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (!req.body.name?.en) {
    errors.push({
      fields: ["name"],
      description: {
        en: "Name in English is required!",
        ar: "التسمية بالإنجليزية مطلوبة!",
      },
      error: status[status.NOT_FOUND].toUpperCase(),
      code: status.NOT_FOUND,
    });
  }

  if (!req.body.name?.ar) {
    errors.push({
      fields: ["name"],
      description: {
        en: "Name in Arabic is required!",
        ar: "التسمية بالعربية مطلوبة!",
      },
      error: status[status.NOT_FOUND].toUpperCase(),
      code: status.NOT_FOUND,
    });
  }

  if (!req.body.iso4217Code) {
    errors.push({
      fields: ["iso4217Code"],
      description: {
        en: "ISO4217 code is required!",
        ar: "رمز ISO4217 مطلوب!",
      },
      error: status[status.NOT_FOUND].toUpperCase(),
      code: status.NOT_FOUND,
    });
  }

  if (req.body.iso4217Code && req.body?.iso4217Code?.length !== 3) {
    errors.push({
      fields: ["iso4217Code"],
      description: {
        en: "ISO4217 code is not valid!",
        ar: "رمز ISO4217 غير صالح!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (req.body.archived && typeof req.body.archived !== "boolean") {
    errors.push({
      fields: ["archived"],
      description: {
        en: "Archiving value must be exculsively boolean!",
        ar: "قيمة الأرشفة يجب أن تكون منطقية حصرا!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (errors.length > 0) {
    const allNotFound: boolean = errors.every(
      (error: ValidationError) => error.code === status.NOT_FOUND
    );
    const allUnprocessable: boolean = errors.every(
      (error: ValidationError) => error.code === status.UNPROCESSABLE_ENTITY
    );

    let finalStatus: number = status.BAD_REQUEST;

    if (allNotFound) {
      finalStatus = status.NOT_FOUND;
    } else if (allUnprocessable) {
      finalStatus = status.UNPROCESSABLE_ENTITY;
    }

    return res.status(finalStatus).json({
      success: false,
      message:
        finalStatus === status.NOT_FOUND
          ? status[status.NOT_FOUND].toUpperCase()
          : finalStatus === status.UNPROCESSABLE_ENTITY
          ? status[status.UNPROCESSABLE_ENTITY].toUpperCase()
          : status[status.BAD_REQUEST].toUpperCase(),
      status: finalStatus,
      errors: errors?.map((error: ValidationError) =>
        filterObject(error, ["error", "code"])
      ),
    });
  }

  next();
};

export const validateCurrencyId = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (!isValidObjectId(req.params.id)) {
    errors.push({
      fields: ["_id"],
      description: {
        en: "Currency's ID seems invalid!",
        ar: "معرف العملة يبدو غير صالح!",
      },
      error: status[status.BAD_REQUEST].toUpperCase(),
      code: status.BAD_REQUEST,
    });
  }

  if (errors.length > 0) {
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: status[status.BAD_REQUEST].toUpperCase(),
      status: status.BAD_REQUEST,
      errors: errors?.map((error: ValidationError) =>
        filterObject(error, ["error", "code"])
      ),
    });
  }

  next();
};


export const validateCurrencyUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (!isValidObjectId(req.params.id)) {
    errors.push({
      fields: ["_id"],
      description: {
        en: "Currency's ID seems invalid!",
        ar: "معرف العملة يبدو غير صالح!",
      },
      error: status[status.BAD_REQUEST].toUpperCase(),
      code: status.BAD_REQUEST,
    });
  }

  if (req.body.iso4217Code && req.body?.iso4217Code?.length !== 3) {
    errors.push({
      fields: ["iso4217Code"],
      description: {
        en: "ISO4217 code is not valid!",
        ar: "رمز ISO4217 غير صالح!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (req.body.symbol && req.body?.symbol?.length !== 1) {
    errors.push({
      fields: ["symbol"],
      description: {
        en: "Symbol is not valid!",
        ar: "العلامة غير صالحة!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (errors.length > 0) {
    const allNotFound: boolean = errors.every(
      (error: ValidationError) => error.code === status.NOT_FOUND
    );
    const allUnprocessable: boolean = errors.every(
      (error: ValidationError) => error.code === status.UNPROCESSABLE_ENTITY
    );

    let finalStatus: number = status.BAD_REQUEST;

    if (allNotFound) {
      finalStatus = status.NOT_FOUND;
    } else if (allUnprocessable) {
      finalStatus = status.UNPROCESSABLE_ENTITY;
    }

    return res.status(finalStatus).json({
      success: false,
      message:
        finalStatus === status.NOT_FOUND
          ? status[status.NOT_FOUND].toUpperCase()
          : finalStatus === status.UNPROCESSABLE_ENTITY
          ? status[status.UNPROCESSABLE_ENTITY].toUpperCase()
          : status[status.BAD_REQUEST].toUpperCase(),
      status: finalStatus,
      errors: errors?.map((error: ValidationError) =>
        filterObject(error, ["error", "code"])
      ),
    });
  }

  next();
};
