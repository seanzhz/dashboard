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
        },
        receiveMessage: (state, action) => {
         // action.payload 应该是一个完整的 message 对象，例如：
             // { messageId, senderId, receiverId, content, createdAt, … }
                 const msg = action.payload;
         const fid = msg.senderId;
         if (!state.friend_messages[fid]) {
               state.friend_messages[fid] = [];
             }
         // 把新的消息推到这个好友对应的消息数组末尾
             state.friend_messages[fid].push({
                   _id: msg.messageId,       // 或者 msg._id、看后端返回结构
               senderId: msg.senderId,
               receiverId: msg.receiverId,
               message: msg.content,
               createdAt: msg.createdAt
         });
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
                const sentToFriend = state.my_friends.find(f => f.friendId === fid);
                if (sentToFriend) {
                       state.my_friends = state.my_friends.filter(f => f.friendId !== fid);
                       state.my_friends.unshift(sentToFriend);
                     }
                state.successMessage = "Message sent successfully";
            })

            .addCase(fetchMessages.fulfilled, (state, {payload}) => {
                const {friendId, messages} = payload;
                state.friend_messages[friendId] = messages;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                  state.loader = false;
                  state.errorMessage = action.payload?.error || action.error?.message || 'Send message failed';
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

export const {messageClear,receiveMessage} = chatReducer.actions;
export default chatReducer.reducer;