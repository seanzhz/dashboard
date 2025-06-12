import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// --- Async thunks for chat operations ---

/**
 * addFriend thunk:
 * - info: { sellerId, userId } or similar
 * - on success expects data: { myFriends: [...], currentFriend: {...}, message?: [...] }
 */
export const addFriend = createAsyncThunk(
    'chat/addFriend',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/chat/customer/add-customer-friend', info, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

/**
 * sendMessage thunk:
 * - info: { userId, sellerId: friendId, content }
 * - on success expects data: { message: { receiverId, senderId, content, createdAt, ... } }
 */
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/chat/customer/send-message', info, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

/**
 * fetchMessages thunk:
 * - params: { userId, friendId }
 * - on success expects data: { messages: [...] }
 */
export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async ({ userId, friendId }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(
                "/chat/customer/fetch-messages",
                { userId, friendId },
                { withCredentials: true }
            );
            // return both friendId and messages
            return fulfillWithValue({ friendId, messages: data.messages });
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: error.message });
        }
    }
);

// --- Chat slice ---

export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,            // indicate loading state for any async op
        my_friends: [],           // array of friend objects: { friendId, name, ... }
        friend_messages: {},      // map friendId -> array of message objects
        currentFriend: null,      // currently selected friend object or ID
    },
    reducers: {
        /**
         * Clear any chat-related messages
         */
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
        /**
         * receiveMessage reducer:
         * Typically called when a socket.io message arrives.
         * payload should be: { messageId, senderId, receiverId, content, createdAt, ... }
         */
        receiveMessage: (state, action) => {
            const msg = action.payload;
            const fid = msg.senderId;
            if (!state.friend_messages[fid]) {
                state.friend_messages[fid] = [];
            }
            // Push normalized message object
            state.friend_messages[fid].push({
                _id: msg.messageId ?? msg._id,
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                message: msg.content,
                createdAt: msg.createdAt,
            });
        }
    },
    extraReducers: (builder) => {
        builder
            // --- addFriend ---
            .addCase(addFriend.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(addFriend.fulfilled, (state, { payload }) => {
                state.loader = false;
                // Expect payload.myFriends as array
                state.my_friends = Array.isArray(payload.myFriends) ? payload.myFriends : [];
                // currentFriend may be an object with friendId property
                state.currentFriend = payload.currentFriend || null;
                // If backend returns initial messages array:
                if (payload.currentFriend && Array.isArray(payload.message)) {
                    const fid = payload.currentFriend.friendId;
                    state.friend_messages[fid] = payload.message;
                }
            })
            .addCase(addFriend.rejected, (state, { payload, error }) => {
                state.loader = false;
                state.errorMessage = payload?.error || error.message || 'Failed to add friend';
            })

            // --- sendMessage ---
            .addCase(sendMessage.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(sendMessage.fulfilled, (state, { payload }) => {
                state.loader = false;
                // Expect payload.message object
                const msg = payload.message;
                const fid = msg.receiverId;
                if (!state.friend_messages[fid]) {
                    state.friend_messages[fid] = [];
                }
                state.friend_messages[fid].push(msg);
                // Move this friend to top of my_friends if exists, to reflect recent chat
                const idx = state.my_friends.findIndex(f => f.friendId === fid);
                if (idx >= 0) {
                    const friendObj = state.my_friends[idx];
                    state.my_friends.splice(idx, 1);
                    state.my_friends.unshift(friendObj);
                }
                state.successMessage = "Message sent successfully";
            })
            .addCase(sendMessage.rejected, (state, { payload, error }) => {
                state.loader = false;
                state.errorMessage = payload?.error || error.message || 'Send message failed';
            })

            // --- fetchMessages ---
            .addCase(fetchMessages.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(fetchMessages.fulfilled, (state, { payload }) => {
                state.loader = false;
                const { friendId, messages } = payload;
                // Ensure messages is array
                state.friend_messages[friendId] = Array.isArray(messages) ? messages : [];
            })
            .addCase(fetchMessages.rejected, (state, { payload, error }) => {
                state.loader = false;
                state.errorMessage = payload?.error || error.message || 'Fetch messages failed';
            });
    }
});

export const { messageClear, receiveMessage } = chatReducer.actions;
export default chatReducer.reducer;