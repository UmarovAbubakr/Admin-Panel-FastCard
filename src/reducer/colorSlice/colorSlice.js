import { createSlice } from "@reduxjs/toolkit";
import { getColors, deleteColor } from "../../api/colorApi/colorApi";

const initialState = {
    value: 0,
    data: [],
    color: []
};

export const ColorSlice = createSlice({
    name: "todoColor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getColors.fulfilled, (state, action) => {
            state.data = action.payload || [];
        })
        builder.addCase(deleteColor.fulfilled, (state, action) => {
            state.data = state.data.filter((item) => item.id !== action.payload);
        })
    },
});

export const { } = ColorSlice.actions;
export default ColorSlice.reducer;