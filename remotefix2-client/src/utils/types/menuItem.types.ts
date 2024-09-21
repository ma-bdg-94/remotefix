import { OffcanvasPlacement } from "react-bootstrap/esm/Offcanvas";
import { ApiError, MultiLanguageText } from "./common";

/** General Structure */ 
export interface MenuItem {
  _id: string;
  label: MultiLanguageText;
  link: string;
  isPrivate: boolean;
  icon?: string;
  scope: string[];
  subItems?: MenuItem[];
  deleted: boolean;
  archived: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

/** Redux-Related Types */
interface MenuItemDetailsResponseData {
  description: MultiLanguageText;
  menuItem: MenuItem;
}
interface MenuItemListResponseData {
  description: MultiLanguageText;
  menuItems: MenuItem[];
}
interface NoMenuItemResponseData {
  description: MultiLanguageText;
}
export interface MenuItemCreationData {
  link: string;
  label: MultiLanguageText;
  isPrivate?: boolean;
  icon?: string;
  scope: string[];
}
export interface MenuItemUpdateData {
  link?: string;
  label?: MultiLanguageText;
  icon?: string;
}
export interface MenuItemUpdateRequestBody {
  menuItemUpdateData: MenuItemUpdateData;
}
export interface MenuItemDetailsResponse {
  success: boolean;
  message: string;
  status: number;
  errors?: ApiError[];
  data?: MenuItemDetailsResponseData;
}
export interface SortOrderCriterion {
  sortOrder: "asc" | "desc";
}
export interface MenuItemScopeFilter {
  scope: string[];
}
export interface MenuItemListResponse {
  success: boolean;
  message: string;
  status: number;
  errors?: ApiError[];
  data?: MenuItemListResponseData;
}
export interface NoMenuItemResponse {
  success: boolean;
  message: string;
  status: number;
  errors?: ApiError[];
  data?: NoMenuItemResponseData;
}

/** Component Props */
export interface HeaderProps {
  bigTitle: string;
}
export interface DrawerProps {
  show: boolean;
  onHide: () => void;
  placement: OffcanvasPlacement | undefined;
}

