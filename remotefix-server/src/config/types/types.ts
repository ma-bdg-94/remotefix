import { FindOperator } from "typeorm";

export interface Multilanguage {
  en: string;
 
}

export interface APIResponse {
  status: number | string;
  messages: string | string[];
  message2?: any;
  data: any;
}

export type DeletedStatus = {
  is_deleted: boolean;
}
