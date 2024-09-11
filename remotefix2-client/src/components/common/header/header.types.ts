import { OffcanvasPlacement } from "react-bootstrap/esm/Offcanvas";
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

export interface DrawerProps {
  show: any;
  onHide: any;
  placement: OffcanvasPlacement | undefined;
}
