export type MultiLanguageText = {
    en: string;
    ar: string
}

export interface ValidationError {
    fields: string[];
    message: MultiLanguageText;
    error: string;
    code: number
}