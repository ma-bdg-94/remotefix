import { Request, Response, NextFunction } from "express";
import * as status from "http-status";
import { isValidObjectId } from "mongoose";
import { ValidationError } from "../../../utils/types/common";
import { filterObject } from "../../../utils/functions/utilities";
import { SORTING_CRITERIA } from "../../../utils/constants/common";

const linkRegex =
  /^(?:(?:https?|ftp):\/\/|#|\/)(?:[\w_-]+(?:\/[\w_-]+)*)?(?:\?[\w_-]+=\w+(&[\w_-]+=\w+)*)?$/;

export const validateMenuItemCreation = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (!req.body.label?.en) {
    errors.push({
      fields: ["label"],
      description: {
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
      description: {
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
      description: {
        en: "Link is required!",
        ar: "الرابط مطلوب!",
      },
      error: status[status.NOT_FOUND].toUpperCase(),
      code: status.NOT_FOUND,
    });
  }

  if (req.body.link && !linkRegex.test(req.body.link)) {
    errors.push({
      fields: ["link"],
      description: {
        en: "Link is not valid!",
        ar: "الرابط غير صالح!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
    });
  }

  if (req.body.icon && typeof req.body.icon !== "string") {
    errors.push({
      fields: ["icon"],
      description: {
        en: "Icon value must be exculsively string!",
        ar: "قيمة النصمة يجب أن تكون متسلسلة حصرا!",
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

  if (!req.body.scope || (req.body.scope && req.body.scope?.length < 1)) {
    errors.push({
      fields: ["scope"],
      description: {
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
      description: {
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

export const validateMenuItemId = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  for (const [paramKey, paramValue] of Object.entries(req.params)) {
    if (!isValidObjectId(paramValue)) {
      errors.push({
        fields: ["_id"],
        description: {
          en: `Menu ${paramKey === 'subItemId' ? 'sub-' : ''}item's ID seems invalid!`,
          ar: `معرف عنصر القائمة ${paramKey === 'subItemId' ? 'الفرعي ' : ''}يبدو غير صالح!`,
        },
        error: status[status.BAD_REQUEST].toUpperCase(),
        code: status.BAD_REQUEST,
      });
    }
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

export const validateMenuItemScope = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (req.body.scope && req.body.scope?.length < 1) {
    errors.push({
      fields: ["scope"],
      description: {
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
      description: {
        en: "Scope value must be exculsively string!",
        ar: "قيمة النطاق يجب أن تكون متسلسلة حصرا!",
      },
      error: status[status.UNPROCESSABLE_ENTITY].toUpperCase(),
      code: status.UNPROCESSABLE_ENTITY,
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

export const validateSortingCriteria = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (!SORTING_CRITERIA.includes(req.query.sortOrder as any)) {
    errors.push({
      fields: ["order"],
      description: {
        en: "Sorting criterion seems invalid!",
        ar: "معامل الترتيب يبدو غير صالح!",
      },
      error: status[status.FORBIDDEN].toUpperCase(),
      code: status.FORBIDDEN,
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

export const validateMenuItemUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> | any => {
  const errors: ValidationError[] = [];

  if (!isValidObjectId(req.params.id)) {
    errors.push({
      fields: ["_id"],
      description: {
        en: "Menu item's ID seems invalid!",
        ar: "معرف عنصر القائمة يبدو غير صالح!",
      },
      error: status[status.BAD_REQUEST].toUpperCase(),
      code: status.BAD_REQUEST,
    });
  }

  if (req.body.link && !linkRegex.test(req.body.link)) {
    errors.push({
      fields: ["link"],
      description: {
        en: "Link is not valid!",
        ar: "الرابط غير صالح!",
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
