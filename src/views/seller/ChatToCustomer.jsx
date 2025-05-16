import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import io from "socket.io-client";
import {addFriend, fetchMessages, sendMessage} from "../../store/Reducers/chatReducer";
const socket = io('http://localhost:8080');

function ChatToCustomer() {
    const {sellerId} = useParams();
    const {userInfo} = useSelector((state) => state.auth);
    const {friend_messages, currentFriend, my_friends} = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const [selectedContact, setSelectedContact] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        socket.emit('add_user', userInfo._id, userInfo);
    }, []);

    useEffect(() => {
        dispatch(addFriend({
            sellerId: sellerId || "",
            userId: userInfo._id,
        }));
    }, [sellerId]);

//选中联系人后，拉取该联系人的历史对话记录
    useEffect(() => {
        if (selectedContact) {
            dispatch(fetchMessages({
                userId: userInfo._id,
                friendId: selectedContact.id
            }));
        }
    }, [selectedContact]);
//当 Redux 中 friend_messages 更新时，同步到本地 state
    useEffect(() => {
        if (!selectedContact) return;
        const msgs = friend_messages[selectedContact.id] || [];
        setMessages(
            msgs.map(m => ({
                sender: m.senderId === userInfo._id ? 'You' : selectedContact.name,
                content: m.message,
                time:   new Date(m.createdAt).toLocaleTimeString(),
            }))
        );
    }, [friend_messages, selectedContact]);

    // 动态联系人列表
    const contactList = my_friends.map((friend) => {
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

    // 默认选择第一个联系人
    useEffect(() => {
        if (contactList.length > 0 && !selectedContact) {
            setSelectedContact(contactList[0]);
            // TODO: 将此处替换为真正的历史消息加载逻辑
            setMessages([]);
        }
    }, [contactList]);

    // 搜索过滤
    const filteredContacts = contactList.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        // TODO: 加载该联系人的聊天记录
        setMessages([]); // 先置空占位
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const newMsg = { sender: 'You', content: newMessage, time: 'Now' };

        // ✅ 立即显示新消息
        setMessages(prev => [...prev, newMsg]);

        // ✅ 后端发送
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
                    {/* 联系人列表 */}
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

                    {/* 聊天区域 */}
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