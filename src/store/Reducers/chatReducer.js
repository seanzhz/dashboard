import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api/api";


export const addFriend = createAsyncThunk(
    'chat/addFriend',
    async (info, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post('/chat/customer/add-customer-friend', info, {withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    })

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (info, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post('/chat/customer/send-message', info, {withCredentials: true})
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    })

export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async ({userId, friendId}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post(
                "/chat/customer/fetch-messages",
                {userId, friendId},
                {withCredentials: true}
            );
            return fulfillWithValue({friendId, messages: data.messages});
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        successMessage: '',
        errorMessage: '',
        my_friends: [],
        friend_messages: {},
        currentFriend: ""
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = '';
            state.successMessage = '';
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(addFriend.pending, (state) => {
                state.loader = true;
            })
            .addCase(addFriend.fulfilled, (state, {payload}) => {
                state.loader = false;
                state.my_friends = payload.myFriends;
                state.currentFriend = payload.currentFriend || null;
                if (payload.currentFriend && Array.isArray(payload.message)) {
                    const fid = payload.currentFriend.friendId;
                    state.friend_messages[fid] = payload.message;
                }
            })
            .addCase(addFriend.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.error;
            })

            .addCase(sendMessage.fulfilled, (state, {payload}) => {
                state.loader = false;
                const msg = payload.message;
                const fid = msg.receiverId;
                if (!state.friend_messages[fid]) {
                    state.friend_messages[fid] = [];
                }
                state.friend_messages[fid].push(msg);
                state.successMessage = "Message sent successfully";
            })

            .addCase(fetchMessages.fulfilled, (state, {payload}) => {
                const {friendId, messages} = payload;
                state.friend_messages[friendId] = messages;
            });
    }
    // extraReducers: (builder) => {
    //     builder.addCase(addFriend.pending, (state, {payload}) => {
    //         state.loader = true;
    //     })
    //         .addCase(addFriend.fulfilled, (state, {payload}) => {
    //             state.loader = false;
    //             state.friend_messages = payload.message;
    //             state.currentFriend = payload.currentFriend;
    //             state.my_friends = payload.myFriends
    //         })
    //         .addCase(addFriend.rejected, (state, action) => {
    //             state.loader = false;
    //             state.errorMessage = action.payload.error;
    //         })
    //         .addCase(sendMessage.fulfilled, (state, {payload}) => {
    //             state.loader = false;
    //
    //             let tempFriends = state.my_friends
    //             let index = tempFriends.findIndex(friend => friend.friendId === payload.message.receiverId)
    //             while( index >0 ){
    //                 let temp = tempFriends[index] ;
    //                 tempFriends[index] = tempFriends[index-1];
    //                 tempFriends[index-1] = temp;
    //                 index--;
    //             }
    //             //state.friend_messages = [...(state.friend_messages || []), payload.message];
    //             const msg = payload.message;
    //             const fid = msg.receiverId;
    //             if (!state.friend_messages[fid]) {
    //                    state.friend_messages[fid] = [];
    //                  }
    //              state.friend_messages[fid].push(msg);
    //             state.my_friends = tempFriends;
    //             state.successMessage = 'Message sent successfully'
    //         })
    //         .addCase(fetchMessages.fulfilled, (state, { payload }) => {
    //             const { friendId, messages } = payload;
    //              const fid = payload.currentFriend.friendId;
    //             state.friend_messages = {
    //                    ...state.friend_messages,
    //                    [fid]: payload.message
    //              };
    //     })
    // }
})

export const {messageClear} = chatReducer.actions;
export default chatReducer.reducer;