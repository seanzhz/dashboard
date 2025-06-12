import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

// --- Async thunks for product operations ---
export const addProduct = createAsyncThunk(
    'product/addProduct',
    async (formData, { rejectWithValue, fulfillWithValue }) => {
        try {
            // Upload new product with multipart/form-data
            const { data } = await api.post('/add-product', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return fulfillWithValue(data);
        } catch (error) {
            // Return structured error payload
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

export const getPreviewProducts = createAsyncThunk(
    'product/getPreviewProducts',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            // Fetch 4 public preview products without authentication
            const { data } = await api.get('/preview-products');
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
            // Fetch products matching the current user
            const { data } = await api.get('/corresponding-product', { withCredentials: true });
            return fulfillWithValue(data.products);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

export const getAllProducts = createAsyncThunk(
    'product/getAllProducts',
    async (params, { rejectWithValue, fulfillWithValue }) => {
        try {
            // Fetch paginated, filtered list of products
            const { data } = await api.get('/get-product', { params, withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

export const getSingleProduct = createAsyncThunk(
    'product/getSingleProduct',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            // Fetch a single product by ID
            const { data } = await api.get(`/get-product/${id}`, { withCredentials: true });
            return fulfillWithValue(data.product);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            // Delete product by ID
            const { data } = await api.delete(`/delete-product/${id}`, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ id, formData }, { rejectWithValue, fulfillWithValue }) => {
        try {
            // Update product with formData
            const { data } = await api.put(`/update-product/${id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

// --- Product slice with reducers and extraReducers ---
export const productReducer = createSlice({
    name: 'product',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        products: [],
        singleProduct: null,
        pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
        previewProducts: [],
        previewLoading: false,
        previewError: null,
    },
    reducers: {
        // Clear any success or error messages
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // --- addProduct handlers ---
            .addCase(addProduct.pending, (state) => {
                state.loader = true;                // show loader
                state.errorMessage = '';            // clear previous errors
            })
            .addCase(addProduct.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;  // display success message
            })
            .addCase(addProduct.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;      // display error message
            })

            // --- getPreviewProducts handlers ---
            .addCase(getPreviewProducts.pending, (state) => {
                state.previewLoading = true;         // show preview loader
                state.previewError = null;
            })
            .addCase(getPreviewProducts.fulfilled, (state, { payload }) => {
                state.previewLoading = false;
                state.previewProducts = payload;     // store 4 preview items
            })
            .addCase(getPreviewProducts.rejected, (state, { payload }) => {
                state.previewLoading = false;
                state.previewError = payload.error;  // handle preview error
            })

            // --- getCorrespondingProduct handlers ---
            .addCase(getCorrespondingProduct.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(getCorrespondingProduct.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.products = payload;
            })
            .addCase(getCorrespondingProduct.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // --- getAllProducts handlers ---
            .addCase(getAllProducts.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(getAllProducts.fulfilled, (state, { payload }) => {
                state.loader = false;
                // safe assignment with fallback
                state.products = payload.products || [];
                state.pagination = {
                    page: payload.page,
                    limit: payload.limit,
                    total: payload.total,
                    totalPages: Math.ceil(payload.total / payload.limit),
                };
            })
            .addCase(getAllProducts.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // --- getSingleProduct handlers ---
            .addCase(getSingleProduct.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(getSingleProduct.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.singleProduct = payload;
            })
            .addCase(getSingleProduct.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;  // ensure errors are shown
                state.singleProduct = null;          // clear stale data
            })

            // --- deleteProduct handlers ---
            .addCase(deleteProduct.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(deleteProduct.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(deleteProduct.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // --- updateProduct handlers ---
            .addCase(updateProduct.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(updateProduct.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(updateProduct.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            });
    }
});

export const { messageClear } = productReducer.actions;
export default productReducer.reducer;