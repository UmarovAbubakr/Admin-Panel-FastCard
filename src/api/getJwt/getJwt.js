import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosRequest, URL } from "../../utils/url";

export const getUserById = createAsyncThunk(
  "jwt/getUserById",
  async (id) => {
    try {
      const { data } = await axiosRequest.get(
        `${URL}/UserProfile/get-user-profile-by-id?id=` + id,

      );
      console.log(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const getUser = createAsyncThunk(
  "jwt/getUser",
  async (id) => {
    try {
      const { data } = await axiosRequest.get(
        `${URL}/UserProfile/get-user-profiles`,
        null,
      );
      return {user:data};
    } catch (error) {
      console.log(error);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "jwt/deleteUser",
  async (id,{dispatch}) => {
    try {
      await axiosRequest.delete(
        `https://store-api.softclub.tj/UserProfile/delete-user?id=`+id,
      );
      dispatch(getUser())
    } catch (error) {
      console.log(error);
    }
  },
);