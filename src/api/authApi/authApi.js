import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL } from "../../utils/url";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user) => {
    try {
      let { data } = await axios.post(`${URL}/Account/register`, user);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const loginUser = createAsyncThunk("auth/loginUser", async (user) => {
  try {
    let { data } = await axios.post(`${URL}/Account/login`, user);
    return data;
  } catch (error) {
    console.log(error);
  }
});