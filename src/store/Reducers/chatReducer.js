import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";
import {jwtDecode} from "jwt-decode";

// export const adminLogin = createAsyncThunk(
//     'auth/adminLogin',
//     async (payload, {rejectWithValue, fulfillWithValue}) => {
//         try {
//             const {data} = await api.post('/admin-login', payload, {withCredentials: true})
//             localStorage.setItem('accessToken', data.token)
//             return fulfillWithValue(data)
//         } catch (error) {
//             return rejectWithValue(error.response.data)
//         }
//     })

export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        successMessage: '',
        errorMessage: '',
        my_friends: [],
        friend_messages:[],
        currentFriend: ""
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = '';
            state.successMessage = '';
        }

    },
    extraReducers: (builder) => {
        // builder.addCase(adminLogin.pending, (state, {payload}) => {
        //     state.loader = true;
        // })
        //     .addCase(adminLogin.fulfilled, (state, action) => {
        //         state.loader = false;
        //         state.successMessage = action.payload.message;
        //         state.token = action.payload.token;
        //         state.role = returnRole(action.payload.token);
        //     })
        //     .addCase(adminLogin.rejected, (state, action) => {
        //         state.loader = false;
        //         state.errorMessage = action.payload.error;
        //     })
    }
})

export const {messageClear} = chatReducer.actions;
export default chatReducer.reducer;