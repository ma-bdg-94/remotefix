import { FindOperator } from "typeorm";

export interface Multilanguage {
  en: string;
 
}

export interface APIResponse {
  status: number | string;
  message: string | string[];
  data: any;
}

export type DeletedStatus = {
  is_deleted: boolean;
}
