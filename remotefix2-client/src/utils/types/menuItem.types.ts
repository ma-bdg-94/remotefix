import { ApiError, MultiLanguageText } from "./common";

export interface MenuItem {
  _id: string;
  label: MultiLanguageText;
  link: string;
  isPrivate: boolean;
  icon?: string;
  scope: string[];
  deleted: boolean;
  archived: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

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
