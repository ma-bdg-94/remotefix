import { createSlice } from "@reduxjs/toolkit";

import { createMenuItem, getAllMenuItems, getAllMenuItemsByScope, getMenuItemById, getPrivateMenuItemsByScope, softDeleteOrRetrieveMenuItem, updateMenuItemArchivedStatus, updateMenuItemPrivacy, updateMenuItemScope } from "../services/menuItem.service";

interface MenuItemState {
  menuItemData: any | null;
  menuItemLoading: boolean | null;
  menuItemList: any | [];
  menuItemError: any | null;
  storedMenuItem: any | null;
}

const initialState = {
  menuItemLoading: false,
  menuItemError: null,
  menuItemData: null,
  menuItemList: [],
  storedMenuItem: null
} as MenuItemState;

const menuItemLoading = (state: MenuItemState) => {
  state.menuItemLoading = true;
};

const menuItemError = (state: MenuItemState, action: any) => {
  state.menuItemError = action.payload;
};

export const menuItemSlice = createSlice({
  name: "menuItem",
  initialState,
  reducers: {
    storeMenuItem: (state, {payload}) => {
      state.storedMenuItem = payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMenuItem.pending, menuItemLoading)
      .addCase(createMenuItem.rejected, menuItemError)
      .addCase(createMenuItem.fulfilled, (state, { payload }) => {
        state.menuItemLoading = false;
        state.menuItemList = [...state.menuItemList, payload];
        state.menuItemData = payload;
      })

      .addCase(getAllMenuItems.pending, menuItemLoading)
      .addCase(getAllMenuItems.rejected, menuItemError)
      .addCase(getAllMenuItems.fulfilled, (state, { payload }) => {
        state.menuItemLoading = false;
        state.menuItemList = payload;
      })

      .addCase(getAllMenuItemsByScope.pending, menuItemLoading)
      .addCase(getAllMenuItemsByScope.rejected, menuItemError)
      .addCase(getAllMenuItemsByScope.fulfilled, (state, { payload }) => {
        state.menuItemLoading = false;
        state.menuItemList = payload;
      })

      .addCase(getPrivateMenuItemsByScope.pending, menuItemLoading)
      .addCase(getPrivateMenuItemsByScope.rejected, menuItemError)
      .addCase(getPrivateMenuItemsByScope.fulfilled, (state, { payload }) => {
        state.menuItemLoading = false;
        state.menuItemList = payload;
      })

      .addCase(getMenuItemById.pending, menuItemLoading)
      .addCase(getMenuItemById.rejected, menuItemError)
      .addCase(getMenuItemById.fulfilled, (state, { payload }) => {
        state.menuItemLoading = false;
        state.menuItemData = payload;
      })

      .addCase(updateMenuItemPrivacy.pending, menuItemLoading)
      .addCase(updateMenuItemPrivacy.rejected, menuItemError)
      .addCase(updateMenuItemPrivacy.fulfilled, (state, { payload }) => {
        state.menuItemLoading = false;
        state.menuItemData = payload
      })

      .addCase(updateMenuItemArchivedStatus.pending, menuItemLoading)
      .addCase(updateMenuItemArchivedStatus.rejected, menuItemError)
      .addCase(updateMenuItemArchivedStatus.fulfilled, (state, { payload }) => {
        state.menuItemLoading = false;
        state.menuItemData = payload;
      })

      .addCase(updateMenuItemScope.pending, menuItemLoading)
      .addCase(updateMenuItemScope.rejected, menuItemError)
      .addCase(updateMenuItemScope.fulfilled, (state, { payload }) => {
        state.menuItemLoading = false;
        state.menuItemData = payload;
      })

      .addCase(softDeleteOrRetrieveMenuItem.pending, menuItemLoading)
      .addCase(softDeleteOrRetrieveMenuItem.rejected, menuItemError)
      .addCase(softDeleteOrRetrieveMenuItem.fulfilled, (state, { payload }) => {
        state.menuItemLoading = false;
        state.menuItemData = payload;
      });
  },
});

// eslint-disable-next-line no-empty-pattern
export const { storeMenuItem } = menuItemSlice.actions;

export default menuItemSlice.reducer;
