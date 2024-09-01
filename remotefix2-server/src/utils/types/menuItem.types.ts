import { Document } from "mongoose";
import { MultiLanguageText } from "./common";

export interface MenuItemInterface extends Document {
    label: MultiLanguageText;
    link: string;
    private: boolean;
    position: string;
    iconed: boolean;
    icon?: string;
    scope: string[];
    hash: boolean
}