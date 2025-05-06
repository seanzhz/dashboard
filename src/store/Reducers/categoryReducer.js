import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";


export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (payload,{rejectWithValue,fulfillWithValue}) => {
        try{
            const {data} = await api.post('/add-category',payload, {withCredentials: true})
            return fulfillWithValue(data)
        }catch (error) {
            return rejectWithValue(error.response.data)
        }
    })

export const getCategory = createAsyncThunk(
    'category/getCategory',
    async (_,{rejectWithValue,fulfillWithValue}) => {
        try{
            const {data} = await api.get('/get-category', {withCredentials: true})
            return fulfillWithValue(data)
        }catch (error) {
            return rejectWithValue(error.response.data)
        }
    })

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/delete-category/${id}`, {
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categories: []
    },
    reducers: {
        messageClear: (state,_) => {
            state.errorMessage = '';
            state.successMessage = '';
        }

    },
    extraReducers:(builder)=>{
           builder
               .addCase(addCategory.fulfilled, (state, {payload}) => {
                   state.loader = false
                   state.successMessage = payload.message
                   state.categories = [...state.categories, payload.category]
            })
               .addCase(addCategory.rejected, (state, {payload}) => {
                   state.loader = false
                   state.errorMessage = payload.error
               })
               .addCase(addCategory.pending, (state, {payload}) => {
                   state.loader = true;
               })
               .addCase(getCategory.pending, (state, {payload}) => {
                   state.loader = true;
               })
               .addCase(getCategory.fulfilled, (state, {payload}) => {
                   state.categories = payload.categoryList
               })
               .addCase(getCategory.rejected, (state, {payload}) => {
                   state.errorMessage = payload.error
               })
               .addCase(deleteCategory.pending, (state, {payload}) => {
                   state.loader = true;
               })
               .addCase(deleteCategory.fulfilled, (state, {payload}) => {
                   state.loader = false;
                   state.successMessage = payload.message
               })
               .addCase(deleteCategory.rejected, (state, {payload}) => {
                   state.errorMessage = payload.error
               })
    }
})

export const {messageClear} = categoryReducer.actions;
export default categoryReducer.reducer;