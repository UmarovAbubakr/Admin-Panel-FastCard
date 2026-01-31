import { createSlice } from "@reduxjs/toolkit";
import { getSubCategory } from "../../api/subCategoryApi/subCategoryApi";

const initialState = {
    data: []
};

export const subCategorySlice = createSlice({
    name: "subCategory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSubCategory.fulfilled, (state, action) => {
            state.data = action.payload.data;
        })
    },
});

export default subCategorySlice.reducer;