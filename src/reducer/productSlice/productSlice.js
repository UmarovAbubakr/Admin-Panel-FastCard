import { createSlice } from "@reduxjs/toolkit";
import { getProducts, postProduct } from "./../../api/productApi/productApi";

const initialState = {
    value: 0,
    data: []
};

export const productSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.data = action.payload
        })
    },
});

export default productSlice.reducer;