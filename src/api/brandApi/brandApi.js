import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosRequest, URL } from './../../utils/url';

export const getBrands = createAsyncThunk(
    'todoBrand/getBrands',
    async (search) => {
        try {
            let { data } = await axios(URL + '/Brand/get-brands?BrandName=' + search)
            return data.data
        } catch (error) {
            console.error(error);
        }
    }
)

export const deleteBrands = createAsyncThunk(
    'todoBrand/DeleteBrands',
    async (id) => {
        try {
            const { data } = await axiosRequest.delete(URL + '/Brand/delete-brand?id=' + id)
            return id
        } catch (error) {
            console.error(error);
        }
    }
)

export const newBrand = createAsyncThunk(
    'todoBrand/NewBrand',
    async (newBrandName, { dispatch }) => {
        try {
            await axiosRequest.post(URL + '/Brand/add-brand?BrandName=' + newBrandName, {})
            dispatch(getBrands())
        } catch (error) {
            console.error(error);
        }
    }
)

export const editBrand = createAsyncThunk(
    'todoBrand/editBrand',
    async (brandData, { dispatch }) => {
        try {
            const { data } = await axiosRequest.put(
                URL + `/Brand/update-brand?Id=${brandData.id}&BrandName=${brandData.name}`,
                {}
            )
            dispatch(getBrands())
        } catch (error) {
            console.error(error);
        }
    }
)