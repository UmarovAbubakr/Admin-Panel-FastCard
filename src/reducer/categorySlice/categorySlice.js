import { createSlice } from "@reduxjs/toolkit";
import { getCategory } from "./../../api/categoryApi/categoryApi";

const initialState = {
    data: []
};

export const categorySlice = createSlice({
    name: "todoCategory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCategory.fulfilled, (state, action) => {
            state.data = action.payload
        })
    },
});

export const { } = categorySlice.actions;

export default categorySlice.reducer;
