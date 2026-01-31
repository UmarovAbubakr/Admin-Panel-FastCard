import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL, axiosRequest } from './../../utils/url';

export const getCategory = createAsyncThunk(
    'todoCategory/getCategory',
    async () => {
        try {
            let { data } = await axios(URL + "/Category/get-categories")
            return data.data
        } catch (error) {
            console.error(error);
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'todoCategory/deleteCategory',
    async (id) => {
        try {
            const { data } = await axios.delete(URL + '/Category/delete-category?id=' + id, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return id
        } catch (error) {
            console.error(error);
        }
    }
)

export const postCategory = createAsyncThunk(
    "todoCategory/postCategory",
    async (formData, { dispatch }) => {
        try {
            const { data } = await axiosRequest.post("/Category/add-category", formData);
            dispatch(getCategory());
            return data;
        } catch (error) {
            console.error(error);
        }
    },
)

export const editCategory = createAsyncThunk(
    'todoCategory/editCategory',
    async (e, { dispatch }) => {
        try {
            const { data } = await axios.put(URL + `/Category/update-category`, e, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(getCategory())   
        } catch (error) {
            console.error(error);
        }
    }
)