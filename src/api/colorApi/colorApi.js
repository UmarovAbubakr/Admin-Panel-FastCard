import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../../utils/url';

export const getColors = createAsyncThunk(
    'todoColor/getColors',
    async (search) => {
        try {
            let { data } = await axios(URL + '/Color/get-colors?ColorName='+search)
            return data.data
        } catch (error) {
            console.error(error);
        }
    }
)

export const deleteColor = createAsyncThunk(
    'todoColor/deleteColor',
    async (id) => {
        try {
            await axios.delete(URL + '/Color/delete-color?id=' + id, {
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

export const newColor = createAsyncThunk(
    'todoColor/newColor',
    async (newColorName, { dispatch }) => {
        try {
            await axios.post(URL + '/Color/add-color?ColorName=' + newColorName, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(getColors())   
        } catch (error) {
            console.error(error);
        }
    }
)

export const editColor = createAsyncThunk(
    'todoColor/editColor',
    async (e, { dispatch }) => {
        try {
            await axios.put(URL + `/Color/update-color?Id=${e.id}&ColorName=${e.name}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(getColors())   
        } catch (error) {
            console.error(error);
        }
    }
)