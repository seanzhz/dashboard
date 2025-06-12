import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import io from "socket.io-client";
import {addFriend, fetchMessages, sendMessage, receiveMessage} from "../../store/Reducers/chatReducer";

// Connect socket.io
const socket = io('http://localhost:8080');

/**
 * ChatToCustomer component
 * Enables real-time chat between current user and customers (seller <-> customer).
 */
function ChatToCustomer() {
    const {sellerId} = useParams();

    // Get current user's chat state from Redux
    const {userInfo} = useSelector((state) => state.auth);
    const {friend_messages, currentFriend, my_friends} = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    // Local state: selected contact, messages, input field, search query
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Add self to socket.io online list on mount.
     */
    useEffect(() => {
        if (userInfo?._id) {
            socket.emit('add_user', userInfo._id, userInfo);
        }
    }, [userInfo]);

    /**
     * On URL param sellerId change, trigger addFriend to get contact list.
     */
    useEffect(() => {
        dispatch(addFriend({
            sellerId: sellerId || "",
            userId: userInfo._id,
        }));
    }, [sellerId, userInfo, dispatch]);

    /**
     * When selectedContact changes, fetch its chat history.
     */
    useEffect(() => {
        if (selectedContact) {
            dispatch(fetchMessages({
                userId: userInfo._id,
                friendId: selectedContact.id
            }));
        }
    }, [selectedContact, userInfo, dispatch]);

    /**
     * When Redux friend_messages updates, map to local messages state.
     */
    useEffect(() => {
        if (!selectedContact) return;
        const msgs = friend_messages[selectedContact.id] || [];
        setMessages(
            msgs.map(m => ({
                sender: m.senderId === userInfo._id ? 'You' : selectedContact.name,
                content: m.message,
                time: new Date(m.createdAt).toLocaleTimeString(),
            }))
        );
    }, [friend_messages, selectedContact, userInfo]);

    /**
     * Socket.io message receiver.
     * Handles:
     * 1. Append message to local if chatting with sender.
     * 2. Sync message into Redux friend_messages.
     * 3. Auto-fetch messages if sender not currently selected.
     */
    useEffect(() => {
        const handleReceive = (data) => {
            // data = { messageId, senderId, receiverId, content, createdAt }

            // 1) Append message if chatting with sender
            if (
                data.receiverId === userInfo._id &&
                selectedContact &&
                data.senderId === selectedContact.id
            ) {
                const incoming = {
                    id: data.messageId,
                    sender: selectedContact.name,
                    content: data.content,
                    time: new Date(data.createdAt).toLocaleTimeString(),
                };
                setMessages(prev => [...prev, incoming]);
            }

            // 2) Sync to Redux
            if (data.receiverId === userInfo._id) {
                dispatch(receiveMessage({
                    messageId: data.messageId,
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    content: data.content,
                    createdAt: data.createdAt
                }));
            }

            // 3) Auto-fetch if not chatting with sender
            if (
                data.receiverId === userInfo._id &&
                (!selectedContact || data.senderId !== selectedContact.id)
            ) {
                dispatch(fetchMessages({
                    userId: userInfo._id,
                    friendId: data.senderId
                }));
            }
        };

        socket.on("receive_message", handleReceive);
        return () => {
            socket.off("receive_message", handleReceive);
        };
    }, [selectedContact, userInfo, dispatch]);

    /**
     * Build contact list from my_friends and friend_messages.
     */
    const contactList = my_friends
        .filter(friend => friend.friendId !== userInfo._id)
        .map((friend) => {
            const message = friend_messages?.find?.((m) =>
                m.senderId === friend.friendId || m.receiverId === friend.friendId
            );

            return {
                id: friend.friendId,
                name: friend.name,
                lastMessage: message?.content || '',
                time: message?.time || '',
            };
        });

    /**
     * Auto-select first contact on first load.
     */
    useEffect(() => {
        if (contactList.length > 0 && !selectedContact) {
            setSelectedContact(contactList[0]);
            dispatch(fetchMessages({
                userId: userInfo._id,
                friendId: contactList[0].id // FIXME: should be contactList[0].id
            }));
        }
    }, [contactList, selectedContact, dispatch, userInfo._id]);

    /**
     * Search filter for contacts.
     */
    const filteredContacts = contactList.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /**
     * Select contact handler.
     */
    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        dispatch(fetchMessages({
            userId: userInfo._id,
            friendId: contact.id
        }));
    };

    /**
     * Send message handler.
     */
    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        // 1) Append locally
        const newMsg = { sender: 'You', content: newMessage, time: 'Now' };
        setMessages(prev => [...prev, newMsg]);

        // 2) Dispatch to backend
        dispatch(sendMessage({
            userId: userInfo._id,
            sellerId: selectedContact.id,
            content: newMessage,
        }));

        setNewMessage('');
    };

    return (
        <div className='px-2 lg:px-7 pt-5 text-theme-text'>
            <h1 className="text-2xl font-bold mb-3">Chat Board</h1>
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border">
                <div className="flex flex-col lg:flex-row h-[500px]">
                    {/* Contact list */}
                    <div className="w-full lg:w-1/3 border-r border-theme-border p-4 overflow-auto bg-theme-bgSecondary max-h-[250px] lg:max-h-none">
                        <h2 className="text-xl font-bold mb-4">Customers</h2>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border border-theme-border rounded focus:outline-none bg-white text-theme-text"
                            />
                        </div>
                        <ul>
                            {filteredContacts.map((contact) => (
                                <li
                                    key={contact.id}
                                    onClick={() => handleContactClick(contact)}
                                    className={`p-3 cursor-pointer rounded mb-2 hover:bg-theme-hover ${
                                        selectedContact?.id === contact.id ? 'bg-theme-hover font-semibold' : ''
                                    }`}
                                >
                                    <div className="font-bold">{contact.name}</div>
                                    <div className="text-sm">{contact.lastMessage}</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Chat area */}
                    <div className="flex-1 flex flex-col p-4 overflow-hidden bg-theme-bgSecondary min-h-[300px]">
                        <div className="mb-4 border-b border-theme-border pb-2">
                            <h2 className="text-xl font-bold">
                                {selectedContact ? `Chat with ${selectedContact.name}` : 'Select a contact to start'}
                            </h2>
                        </div>

                        <div className="flex-1 overflow-auto space-y-3">
                            {messages.length > 0 ? messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === 'You' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                                            msg.sender === 'You'
                                                ? 'bg-theme-primary text-white'
                                                : 'bg-white text-theme-text border border-theme-border'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500">No messages yet.</p>
                            )}
                        </div>

                        <div className="flex mt-4">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 border border-theme-border rounded-l px-4 py-2 focus:outline-none bg-white text-theme-text"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-theme-primary text-white px-4 py-2 rounded-r hover:bg-theme-primaryHover transition duration-200"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatToCustomer;