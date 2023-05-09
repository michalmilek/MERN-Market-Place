import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loadersSliceReducer from "./loadersSlice";
import usersSliceReducer from "./usersSlice";

const rootReducer = combineReducers({
  loaders: loadersSliceReducer,
  users: usersSliceReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
