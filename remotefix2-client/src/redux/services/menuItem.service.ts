import { createAsyncThunk } from "@reduxjs/toolkit";
import { menuItemInstance } from "../instances";
import { AsyncThunkConfig } from "../store";
import {
  MenuItemDetailsResponse,
  MenuItemListResponse,
  MenuItemCreationData,
  MenuItemUpdateRequestBody,
  MenuItemScopeFilter,
  SortOrderCriterion,
  NoMenuItemResponse,
} from "../../utils/types/menuItem.types";
import { Id } from "../../utils/types/common";

const headerConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const createMenuItem = createAsyncThunk<
  MenuItemDetailsResponse,
  MenuItemCreationData,
  AsyncThunkConfig
>(
  "menu_item/create",
  async (menuItemCreationData: MenuItemCreationData, { rejectWithValue }) => {
    try {
      const response = await menuItemInstance.post<MenuItemDetailsResponse>(
        "/",
        menuItemCreationData,
        headerConfig
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllMenuItems = createAsyncThunk<
  MenuItemListResponse,
  SortOrderCriterion,
  AsyncThunkConfig
>(
  "menu_item/get_all",
  async ({ sortOrder }: SortOrderCriterion, { rejectWithValue }) => {
    try {
      const response = await menuItemInstance.get<MenuItemListResponse>(
        `/all?sortOrder=${sortOrder}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllMenuItemsByScope = createAsyncThunk<
  MenuItemListResponse,
  SortOrderCriterion & MenuItemScopeFilter,
  AsyncThunkConfig
>(
  "menu_item/get_all_by_scope",
  async (
    { sortOrder, scope }: SortOrderCriterion & MenuItemScopeFilter,
    { rejectWithValue }
  ) => {
    try {
      const scopeQueryString = scope
        .map((s) => `scope=${encodeURIComponent(s)}`)
        .join("&");
      const response = await menuItemInstance.get<MenuItemListResponse>(
        `/all/public/scope?sortOrder=${sortOrder}&${scopeQueryString}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPrivateMenuItemsByScope = createAsyncThunk<
  MenuItemListResponse,
  SortOrderCriterion & MenuItemScopeFilter,
  AsyncThunkConfig
>(
  "menu_item/get_private_by_scope",
  async (
    { sortOrder, scope }: SortOrderCriterion & MenuItemScopeFilter,
    { rejectWithValue }
  ) => {
    try {
      const scopeQueryString = scope
        .map((s) => `scope=${encodeURIComponent(s)}`)
        .join("&");
      const response = await menuItemInstance.get<MenuItemListResponse>(
        `/all/private/scope?sortOrder=${sortOrder}&${scopeQueryString}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMenuItemById = createAsyncThunk<
  MenuItemDetailsResponse,
  Id,
  AsyncThunkConfig
>("menu_item/get_single_by_id", async ({ id }: Id, { rejectWithValue }) => {
  try {
    const response = await menuItemInstance.get<MenuItemDetailsResponse>(
      `/single/${id}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateMenuItemPrivacy = createAsyncThunk<
  MenuItemDetailsResponse,
  Id,
  AsyncThunkConfig
>("menu_item/update_privacy", async ({ id }: Id, { rejectWithValue }) => {
  try {
    const response = await menuItemInstance.patch<MenuItemDetailsResponse>(
      `/privacy/${id}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateMenuItemArchivedStatus = createAsyncThunk<
  MenuItemDetailsResponse,
  Id,
  AsyncThunkConfig
>(
  "menu_item/update_archived_status",
  async ({ id }: Id, { rejectWithValue }) => {
    try {
      const response = await menuItemInstance.patch<MenuItemDetailsResponse>(
        `/archive/${id}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMenuItemScope = createAsyncThunk<
  MenuItemDetailsResponse,
  Id & MenuItemScopeFilter,
  AsyncThunkConfig
>(
  "menu_item/update_scope",
  async ({ id, scope }: Id & MenuItemScopeFilter, { rejectWithValue }) => {
    try {
      const response = await menuItemInstance.patch<MenuItemDetailsResponse>(
        `/scope/${id}`,
        { scope },
        headerConfig
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const softDeleteOrRetrieveMenuItem = createAsyncThunk<
  MenuItemDetailsResponse,
  Id,
  AsyncThunkConfig
>(
  "menu_item/soft_delete_or_retrieve",
  async ({ id }: Id, { rejectWithValue }) => {
    try {
      const response = await menuItemInstance.patch<MenuItemDetailsResponse>(
        `/soft/${id}`,
        headerConfig
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMenuItem = createAsyncThunk<
  MenuItemDetailsResponse,
  Id & MenuItemUpdateRequestBody,
  AsyncThunkConfig
>(
  "menu_item/update",
  async (
    { id, menuItemUpdateData }: Id & MenuItemUpdateRequestBody,
    { rejectWithValue }
  ) => {
    try {
      const response = await menuItemInstance.put<MenuItemDetailsResponse>(
        `/${id}`,
        menuItemUpdateData,
        headerConfig
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeMenuItem = createAsyncThunk<
  NoMenuItemResponse,
  Id,
  AsyncThunkConfig
>("menu_item/remove", async ({ id }: Id, { rejectWithValue }) => {
  try {
    const response = await menuItemInstance.delete<NoMenuItemResponse>(
      `/${id}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});
