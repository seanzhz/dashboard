import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import {jwtDecode} from "jwt-decode";

/**
 * Admin login thunk
 */
export const adminLogin = createAsyncThunk(
    'auth/adminLogin',
    async (payload, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/admin-login', payload, { withCredentials: true });
            localStorage.setItem('accessToken', data.token);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

/**
 * User login thunk
 */
export const userLogin = createAsyncThunk(
    'auth/userLogin',
    async (payload, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/user-login', payload, { withCredentials: true });
            localStorage.setItem('accessToken', data.token);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

/**
 * Logout thunk
 */
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            await api.post('/logout', {}, { withCredentials: true });
            localStorage.removeItem('accessToken');
            return fulfillWithValue();
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

/**
 * Fetch current user info thunk
 */
export const getUserInfo = createAsyncThunk(
    'auth/getUserInfo',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/get-user', { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

/**
 * User registration thunk
 */
export const userRegister = createAsyncThunk(
    'auth/userRegister',
    async (payload, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/user-register', payload, { withCredentials: true });
            localStorage.setItem('accessToken', data.token);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

/**
 * Update user profile thunk
 */
export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ({ id, formData }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/update-user/${id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

/**
 * Update account credentials thunk
 */
export const updateAccount = createAsyncThunk(
    'auth/updateAccount',
    async ({ id, oldPassword, newPassword }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/update-account/${id}`, { oldPassword, newPassword }, {
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

/**
 * Decode JWT and extract user role, remove expired token
 */
const returnRole = (token) => {
    if (!token) return '';
    try {
        const decoded = jwtDecode(token);
        if (Date.now() > decoded.exp * 1000) {
            localStorage.removeItem('accessToken');
            return '';
        }
        return decoded.role;
    } catch {
        localStorage.removeItem('accessToken');
        return '';
    }
};

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        token: localStorage.getItem('accessToken'),
        role: returnRole(localStorage.getItem('accessToken')),
    },
    reducers: {
        // Clear any auth-related messages
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // adminLogin
            .addCase(adminLogin.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(adminLogin.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })
            .addCase(adminLogin.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // userRegister
            .addCase(userRegister.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(userRegister.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })
            .addCase(userRegister.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // userLogin
            .addCase(userLogin.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(userLogin.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })
            .addCase(userLogin.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // getUserInfo
            .addCase(getUserInfo.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(getUserInfo.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
            })
            .addCase(getUserInfo.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // logout
            .addCase(logout.pending, (state) => {
                state.loader = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loader = false;
                state.token = null;
                state.userInfo = null;
                state.role = '';
            })
            .addCase(logout.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // updateUser
            .addCase(updateUser.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(updateUser.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.userInfo = { ...state.userInfo, ...payload.user };
            })
            .addCase(updateUser.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })

            // updateAccount
            .addCase(updateAccount.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(updateAccount.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(updateAccount.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            });
    },
});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;