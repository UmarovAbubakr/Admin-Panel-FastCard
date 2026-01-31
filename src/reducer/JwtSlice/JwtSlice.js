import { getUserById,getUser } from "@/api/getJwt/getJwt";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    user:[],
    loading: false,
    error: null
};

export const jwtSlice = createSlice({
    name: "jwt",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default jwtSlice.reducer;