import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import io from "socket.io-client";
const socket = io('http://localhost:8080');

function ChatToCustomer() {

    const {sellerId} = useParams();
    const {userInfo} = useSelector((state) => state.auth);
    console.log("sellerID is: " + sellerId + "User ID is: " + userInfo._id);

    useEffect(() => {
        socket.emit('add_user', userInfo._id, userInfo);
    },[])

    const chatContacts = [
        { id: 1, name: 'Alice', lastMessage: 'Hi there!', time: '10:30 AM' },
        { id: 2, name: 'Bob', lastMessage: 'How are you?', time: '9:45 AM' },
        { id: 3, name: 'Charlie', lastMessage: 'See you soon', time: 'Yesterday' },
    ];

    const initialMessages = {
        1: [
            { sender: 'Alice', content: 'Hi there!', time: '10:30 AM' },
            { sender: 'You', content: 'Hello Alice!', time: '10:32 AM' },
        ],
        2: [
            { sender: 'Bob', content: 'How are you?', time: '9:45 AM' },
            { sender: 'You', content: "I'm good, thanks!", time: '9:46 AM' },
        ],
        3: [
            { sender: 'Charlie', content: 'See you soon', time: 'Yesterday' },
        ],
    };

    const [selectedContact, setSelectedContact] = useState(chatContacts[0]);
    const [messages, setMessages] = useState(initialMessages[selectedContact.id] || []);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = chatContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        setMessages(initialMessages[contact.id] || []);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const newMsg = { sender: 'You', content: newMessage, time: 'Now' };
        setMessages([...messages, newMsg]);
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
                                        selectedContact.id === contact.id ? 'bg-theme-hover font-semibold' : ''
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
                            <h2 className="text-xl font-bold">Chat with {selectedContact.name}</h2>
                        </div>

                        <div className="flex-1 overflow-auto space-y-3">
                            {messages.map((msg, index) => (
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
                            ))}
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