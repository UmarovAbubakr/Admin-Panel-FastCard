import { createSlice } from "@reduxjs/toolkit";
import { getBrands, deleteBrands } from "../../api/brandApi/brandApi";

const initialState = {
    value: 0,
    data:[],
    brand:[]
};

export const brandSlice = createSlice({
    name: "todoBrand",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getBrands.fulfilled, (state, action) => {
            state.data = action.payload
        })
        builder.addCase(deleteBrands.fulfilled, (state, action) => {
            state.data = state.data.filter((item) => item.id !== action.payload)
        })
    },
});

export const { } = brandSlice.actions;

export default brandSlice.reducer;
