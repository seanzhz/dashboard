import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const addProduct = createAsyncThunk(
    'product/addProduct',
    async (formData, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/add-product', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// 新增：获取公开预览的 4 条商品
export const getPreviewProducts = createAsyncThunk(
    'product/getPreviewProducts',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            // 直接请求 /preview-products，不带认证
            const { data } = await api.get('/preview-products');
            // data = { products, page, limit, total, totalPages }
            return fulfillWithValue(data.products);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

export const getCorrespondingProduct = createAsyncThunk(
    'product/getCorrespondingProduct',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/corresponding-product', { withCredentials: true });
            return fulfillWithValue(data.products);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllProducts = createAsyncThunk(
    'product/getAllProducts',
    async ({ page = 1, limit = 4, search = '', category = '', sell = true, exchange = true}, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/get-product', {
                params: { page, limit, search, category,sell,exchange },
                withCredentials: true
            });
            return fulfillWithValue(data);  // 包含 products 和 pagination info
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getSingleProduct = createAsyncThunk(
    'product/getSingleProduct',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-product/${id}`, { withCredentials: true });
            return fulfillWithValue(data.product);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/delete-product/${id}`, {
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ id, formData }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/update-product/${id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const productReducer = createSlice({
    name: 'product',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        products: [],
        singleProduct: null,
        total: 0,
        pagination: {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
        },
        previewProducts: [], // ← 新增：存储登录页的 4 条预览
        previewLoading: false,
        previewError: null
    },
    reducers: {
        messageClear: (state,_) => {
            state.errorMessage = '';
            state.successMessage = '';
        }

    },
    extraReducers:(builder)=>{
        builder
            .addCase(addProduct.pending, (state) => {
                state.loader = true;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload.message;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.error;
            })
            .addCase(getCorrespondingProduct.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.products = payload;
            })
            .addCase(getCorrespondingProduct.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error;
            })
            .addCase(deleteProduct.fulfilled, (state, {payload}) => {
                state.loader = false;
                state.successMessage = payload.message
            })
            .addCase(deleteProduct.rejected, (state, {payload}) => {
                state.loader = false;
                state.errorMessage = payload.error
            })
            .addCase(getSingleProduct.pending, (state) => {
                state.loader = true;
            })
            .addCase(getSingleProduct.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.singleProduct = payload;
            })
            .addCase(getSingleProduct.rejected, (state, { payload }) => {
                state.loader = false;
            })
            .addCase(updateProduct.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
        })
            .addCase(updateProduct.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error;
            })
            .addCase(updateProduct.pending, (state, { payload }) => {
            state.loader = true;
        })
            .addCase(getAllProducts.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.products = payload.products || [];     // ✅ 关键
                state.pagination = {
                    page: payload.page,
                    limit: payload.limit,
                    total: payload.total,
                    totalPages: Math.ceil(payload.total / payload.limit),
                };
            })
            .addCase(getAllProducts.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error;
            })
            .addCase(getAllProducts.pending, (state, { payload }) => {
                state.loader = true;
            })
        /* ===== 新增 getPreviewProducts 的处理 ===== */
    .addCase(getPreviewProducts.pending, (state) => {
            state.previewLoading = true;
            state.previewError = null;
        })
            .addCase(getPreviewProducts.fulfilled, (state, { payload }) => {
                state.previewLoading = false;
                state.previewProducts = payload; // 存储 4 条商品
            })
            .addCase(getPreviewProducts.rejected, (state, { payload }) => {
                state.previewLoading = false;
                state.previewError = payload?.error || 'Failed to load preview products';
            });

    }
})

export const {messageClear} = productReducer.actions;
export default productReducer.reducer;