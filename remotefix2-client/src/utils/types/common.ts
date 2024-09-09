export type MultiLanguageText = {
  en: string;
  ar: string;
};

export interface ApiError {
  fields: string[];
  description: MultiLanguageText;
}

export interface Id {
  id: string;
}
