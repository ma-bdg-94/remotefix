export type MultiLanguageText = {
    en: string;
    ar: string
}

export interface ValidationError {
    fields: string[];
    description: MultiLanguageText;
    error: string;
    code: number
}