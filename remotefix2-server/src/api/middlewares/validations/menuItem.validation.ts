import { Request, Response, NextFunction } from "express";
import * as status from "http-status";
import { isValidObjectId } from "mongoose";
import { ValidationError } from "../../../utils/types/common";

export const validateMenuItemCreation = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (!req.body.label?.en) {
    errors.push({
      fields: ["label"],
      message: {
        en: "Label in English is required!",
        ar: "التسمية بالإنجليزية مطلوبة!",
      },
      error: status[status.NOT_FOUND].toUpperCase(),
      code: status.NOT_FOUND,
    });
  }

  if (!req.body.label?.ar) {
    errors.push({
      fields: ["label"],
      message: {
        en: "Label in Arabic is required!",
        ar: "التسمية بالعربية مطلوبة!",
      },
      error: status[status.NOT_FOUND].toUpperCase(),
      code: status.NOT_FOUND,
    });
  }

  if (!req.body.link) {
    errors.push({
      fields: ["link"],
      message: {
        en: "Link is required!",
        ar: "الرابط مطلوب!",
      },
      error: status[status.NOT_FOUND].toUpperCase(),
      code: status.NOT_FOUND,
    });
  }

  if (
    req.body.link &&
    (!req.body.link?.startsWith("/") ||
      !req.body.link?.startsWith("http") ||
      !req.body.link?.startsWith("#") ||
      typeof req.body.link !== "string")
  ) {
    errors.push({
      fields: ["link"],
      message: {
        en: "Link is not valid!",
        ar: "الرابط غير صالح!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (!req.body.private) {
    errors.push({
      fields: ["private"],
      message: {
        en: "Please specify if it is private or public link!",
        ar: "الرجاء تحديد ما إذا كان الرابط عاما أو خاصا!",
      },
      error: status[status.NOT_FOUND].toUpperCase(),
      code: status.NOT_FOUND,
    });
  }

  if (req.body.private && typeof req.body.private !== "boolean") {
    errors.push({
      fields: ["private"],
      message: {
        en: "Privacy value must be exculsively boolean!",
        ar: "قيمة الخصوصية يجب أن تكون منطقية حصرا!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (req.body.icon && typeof req.body.icon !== "string") {
    errors.push({
      fields: ["icon"],
      message: {
        en: "Icon value must be exculsively string!",
        ar: "قيمة النصمة يجب أن تكون متسلسلة حصرا!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (!req.body.scope || (req.body.scope && req.body.scope?.length < 1)) {
    errors.push({
      fields: ["scope"],
      message: {
        en: "Please specify one scope at least!",
        ar: "الرجاء تحديد نطاق واحد على الأقل!",
      },
      error: status[status.NOT_FOUND].toUpperCase(),
      code: status.NOT_FOUND,
    });
  }

  if (
    req.body.scope &&
    !req.body.scope?.every((it: any) => typeof it === "string")
  ) {
    errors.push({
      fields: ["scope"],
      message: {
        en: "Scope value must be exculsively string!",
        ar: "قيمة النطاق يجب أن تكون متسلسلة حصرا!",
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
      status:
        finalStatus === status.NOT_FOUND
          ? status[status.NOT_FOUND].toUpperCase()
          : finalStatus === status.UNPROCESSABLE_ENTITY
          ? status[status.UNPROCESSABLE_ENTITY].toUpperCase()
          : status[status.BAD_REQUEST].toUpperCase(),
      code: finalStatus,
      errors,
    });
  }

  next();
};

export const validateMenuItemId = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (!isValidObjectId(req.params.menuItemId)) {
    errors.push({
      fields: ["_id"],
      message: {
        en: "Menu item's ID seems invalid!",
        ar: "معرف عنصر القائمة يبدو غير صالح!",
      },
      error: status[status.BAD_REQUEST].toUpperCase(),
      code: status.BAD_REQUEST,
    });
  }

  if (errors.length > 0) {
    return res.status(status.BAD_REQUEST).json({
      success: false,
      status: status[status.BAD_REQUEST].toUpperCase(),
      code: status.BAD_REQUEST,
      errors,
    });
  }

  next();
};

export const validateMenuItemUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (!isValidObjectId(req.params.menuItemId)) {
    errors.push({
      fields: ["_id"],
      message: {
        en: "Menu item's ID seems invalid!",
        ar: "معرف عنصر القائمة يبدو غير صالح!",
      },
      error: status[status.BAD_REQUEST].toUpperCase(),
      code: status.BAD_REQUEST,
    });
  }

  if (
    req.body.link &&
    (!req.body.link?.startsWith("/") ||
      !req.body.link?.startsWith("http") ||
      typeof req.body.link !== "string")
  ) {
    errors.push({
      fields: ["link"],
      message: {
        en: "Link is not valid!",
        ar: "الرابط غير صالح!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (req.body.private && typeof req.body.private !== "boolean") {
    errors.push({
      fields: ["private"],
      message: {
        en: "Privacy value must be exculsively boolean!",
        ar: "قيمة الخصوصية يجب أن تكون منطقية حصرا!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (
    req.body.scope &&
    !req.body.scope?.every((it: any) => typeof it === "string")
  ) {
    errors.push({
      fields: ["scope"],
      message: {
        en: "Scope value must be exculsively string!",
        ar: "قيمة النطاق يجب أن تكون متسلسلة حصرا!",
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
      status:
        finalStatus === status.NOT_FOUND
          ? status[status.NOT_FOUND].toUpperCase()
          : finalStatus === status.UNPROCESSABLE_ENTITY
          ? status[status.UNPROCESSABLE_ENTITY].toUpperCase()
          : status[status.BAD_REQUEST].toUpperCase(),
      code: finalStatus,
      errors,
    });
  }

  next();
};
