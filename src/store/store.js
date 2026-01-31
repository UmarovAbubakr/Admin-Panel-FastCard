import { configureStore } from "@reduxjs/toolkit";
import BrandSlice from "./../reducer/brandSlice/brandSlice";
import CategorySlice from "./../reducer/categorySlice/categorySlice";
import SubCategorySlice from "./../reducer/subCategorySlice/subCategorySlice";
import colorReducer from "./../reducer/colorSlice/colorSlice";
import authSlice from "@/reducer/authSlice/authSlice";
import ProductReducer from "@/reducer/productSlice/productSlice";
import jwtReducer from "../reducer/JwtSlice/JwtSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    todoBrand: BrandSlice,
    todoCategory: CategorySlice,
    subCategory: SubCategorySlice,
    todoColor: colorReducer,
    todo: ProductReducer,
    jwt: jwtReducer
  },
});