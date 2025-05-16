import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";
import {jwtDecode} from "jwt-decode";

export const adminLogin = createAsyncThunk(
    'auth/adminLogin',
    async (payload, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post('/admin-login', payload, {withCredentials: true})
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    })

export const sellerLogin = createAsyncThunk(
    'auth/sellerLogin',
    async (payload, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post('/seller-login', payload, {withCredentials: true})
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    })

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, {rejectWithValue, fulfillWithValue}) => {
        try {
            await api.post('/logout', {}, {withCredentials: true});
            localStorage.removeItem('accessToken');
            return fulfillWithValue();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    })

export const getUserInfo = createAsyncThunk(
    'auth/getUserInfo',
    async (_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/get-user', {withCredentials: true})
            //localStorage.setItem('accessToken',data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    })


export const sellerRegister = createAsyncThunk(
    'auth/sellerRegister',
    async (payload, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post('/seller-register', payload, {withCredentials: true})
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    })

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ({id, formData}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.put(`/update-user/${id}`, formData, {
                withCredentials: true,
                headers: {'Content-Type': 'multipart/form-data'},
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateAccount = createAsyncThunk(
    'auth/updateAccount',
    async ({id, newPassword,oldPassword}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.put(`/update-account/${id}`, {newPassword,oldPassword}, {
                withCredentials: true,
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const returnRole = (token) => {
    if (token) {
        const decodedToken = jwtDecode(token)
        const expireTime = new Date(decodedToken.exp * 1000)
        if (new Date().getTime() > expireTime) {
            localStorage.removeItem('accessToken')
            return ''
        } else {
            return decodedToken.role
        }
    } else {
        return ''
    }
}

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        role: returnRole(localStorage.getItem('accessToken')),
        token: localStorage.getItem('accessToken') || null,
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = '';
            state.successMessage = '';
        }

    },
    extraReducers: (builder) => {
        builder.addCase(adminLogin.pending, (state, {payload}) => {
            state.loader = true;
        })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload.message;
                state.token = action.payload.token;
                state.role = returnRole(action.payload.token);
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.error;
            })
            .addCase(sellerRegister.pending, (state, {payload}) => {
                state.loader = true;
            })
            .addCase(sellerRegister.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload.message;
                state.token = action.payload.token;
                state.role = returnRole(action.payload.token);
            })
            .addCase(sellerRegister.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.error;
            })

            .addCase(sellerLogin.pending, (state, {payload}) => {
                state.loader = true;
            })
            .addCase(sellerLogin.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload.message;
                state.token = action.payload.token;
                state.role = returnRole(action.payload.token);
            })
            .addCase(sellerLogin.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.error;
            })
            .addCase(getUserInfo.fulfilled, (state, {payload}) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
            })
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.userInfo = null;
                state.role = null;
            })
            .addCase(updateUser.fulfilled, (state, {payload}) => {
                state.loader = false;
                state.userInfo = {
                    ...state.userInfo,        // 保留旧字段
                    ...payload.user         // 合并新字段（例如 username, contact, image）
                };
                state.successMessage = payload.message;
            })
            .addCase(updateUser.rejected, (state, {payload}) => {
                state.loader = false;
                state.errorMessage = payload?.error;
            })
            .addCase(updateUser.pending, (state, {payload}) => {
                state.loader = true;
            })
            .addCase(updateAccount.fulfilled, (state, {payload}) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(updateAccount.rejected, (state, {payload}) => {
                state.loader = false;
                state.errorMessage = payload?.error;
            })
            .addCase(updateAccount.pending, (state, {payload}) => {
                state.loader = true;
            })

    }
})

export const {messageClear} = authReducer.actions;
export default authReducer.reducer;