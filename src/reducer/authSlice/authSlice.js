import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../api/authApi/authApi";
import { saveToken } from "../../utils/url";

const initialState = {
  value: 0,
  statusRegistration: false,
  statusLogin: false,
  errorMessege: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.statusRegistration = action.payload.statusCode == 200 ? true : false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.statusLogin = action.payload.statusCode == 200 ? true : false;
      saveToken(action.payload.data);
    });
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;