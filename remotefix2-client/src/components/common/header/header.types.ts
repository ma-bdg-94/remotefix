import { MultiLanguageText } from "../../../utils/types/common";

export type NavItem = {
  id: number | string;
  label: MultiLanguageText;
  private: boolean;
  link: string;
  scope: string[];
  icon?: string[];
};

export interface HeaderProps {
  bigTitle: string;
}
