import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LoadingState {
  loading: boolean;
}

const initialState: LoadingState = {
  loading: false,
};

export const loadersSlice = createSlice({
  name: "loaders",
  initialState,
  reducers: {
    SetLoader: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { SetLoader } = loadersSlice.actions;

export default loadersSlice.reducer;
