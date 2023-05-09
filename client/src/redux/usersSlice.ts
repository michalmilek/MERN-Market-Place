import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user: {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    profilePicture: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

const initialState: UserState | { user: null } = {
  user: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    SetUser: (state, action: PayloadAction<UserState | { user: null }>) => {
      (state.user as any) = action.payload;
    },
  },
});

export const { SetUser } = usersSlice.actions;

export default usersSlice.reducer;
