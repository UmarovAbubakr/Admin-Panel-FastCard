import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, URL } from '../../utils/url';

export const getSubCategory = createAsyncThunk(
    'subCategory/getSubCategory',
    async () => {
        try {
            let { data } = await axios.get(URL + '/SubCategory/get-sub-category')
            return data
        } catch (error) {
            console.error(error);
        }
    }
)

export const deleteSubCategory = createAsyncThunk(
    'subCategory/deleteSubCategory',
    async (id) => {
        try {
            const { data } = await axiosRequest.delete(URL + '/SubCategory/delete-sub-category?id=' + id)
            return id
        } catch (error) {
            console.error(error);
        }
    }
)

export const postSubCategory = createAsyncThunk(
    'subCategory/postSubCategory',
    async (subCategoryName, { dispatch }) => {
        try {
            await axiosRequest.post(URL + '/SubCategory/add-sub-category?SubCategoryName=' + subCategoryName)
            dispatch(getSubCategory())
        } catch (error) {
            console.error(error);
        }
    }
)

export const editSubCategory = createAsyncThunk(
    'subCategory/editSubCategory',
    async (dataObj, { dispatch }) => {
        try {
            const { data } = await axiosRequest.put(
                URL + `/SubCategory/update-sub-category?Id=${dataObj.id}&SubCategoryName=${dataObj.name}`,
                {},)
            dispatch(getSubCategory())
        } catch (error) {
            console.error(error);
        }
    }
)