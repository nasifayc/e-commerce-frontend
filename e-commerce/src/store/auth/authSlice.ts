import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../interface/User";

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{ user: User | null; accessToken: string | null }>
    ) => {
      console.log(
        "settting data ... ",
        action.payload.accessToken,
        action.payload.user
      );
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },

    clearAuthData: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
