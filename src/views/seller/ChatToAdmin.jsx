import React, { useState } from 'react';

function ChatToAdmin() {
    const chatContacts = [
        { id: 1, name: 'Admin', lastMessage: 'Hi there!', time: '10:30 AM' },
    ];

    const initialMessages = {
        1: [
            { sender: 'Alice', content: 'Hi there!', time: '10:30 AM' },
            { sender: 'You', content: 'Hello Alice!', time: '10:32 AM' },
        ]
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
        <div className="px-2 lg:px-7 pt-5 text-theme-text">
            <h1 className="text-2xl font-bold mb-3">Admin Contact Detail</h1>
            <div className="w-full p-4 bg-theme-bgSecondary rounded-md border border-theme-border">
                <div className="flex flex-col lg:flex-row h-[300px]">
                    {/* Left side: guidance in English */}
                    <div className="flex-1 p-6 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-theme-border">
                        <h2 className="text-xl font-semibold mb-4">Need Assistance?</h2>
                        <ul className="list-disc list-inside space-y-2 text-theme-subtext">
                            <li>If you run into any issues while using our platform,</li>
                            <li>please first consult the Help Center and FAQs.</li>
                            <li>If you still have questions, feel free to contact our admin below.</li>
                            <li>We aim to respond within one business day.</li>
                        </ul>
                    </div>

                    {/* Right side: admin contact info */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                        <h2 className="text-xl font-semibold mb-4">Contact Admin</h2>
                        <p className="mb-2">
                            <span className="font-medium">Email:</span>{" "}
                            <a
                                href="mailto:seanzhu.career@gmail.com"
                                className="text-theme-primary hover:underline"
                            >
                                seanzhu.career@gmail.com
                            </a>
                        </p>
                        <p>
                            <span className="font-medium">Hours:</span> 10 AM – 6 PM, Weekdays
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatToAdmin;