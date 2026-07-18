import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  type TypedUseSelectorHook,
  useSelector,
} from "react-redux";
import scenario from "./slices/scene";

export const store = configureStore({
  reducer: { scenario },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
