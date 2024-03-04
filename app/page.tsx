'use client';

import MessageList from '@/components/MessageList';
import { delay } from '@/libs/utils';
import { IChatHistory, IMessage } from '@/shared/message';
import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

// Function to get initial mode from localStorage if available
const isOnDarkMode = () => {
    const dark =
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return dark;
};

export default function Home() {
    // Dark - Light mode
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [chatList, setChatList] = useState<IChatHistory[]>([
        {
            id: 1,
            title: 'Chat 1',
            messages: [
                { text: 'Hello! How can I help you?', isUser: false },
                { text: 'Can you provide more information?', isUser: true },
                { text: 'Sure! What do you need help with?', isUser: false },
            ],
        },
        {
            id: 2,
            title: 'Chat 2',
            messages: [
                { text: 'Chào anh hai', isUser: true },
                { text: 'Quen biết đéo gì mà chào', isUser: false },
            ],
        },
        {
            id: 3,
            title: 'Chat 3',
            messages: [],
        },
    ]);
    const [chatId, setChatId] = useState<number>(1);
    const currentChat = chatList.find((chat) => chat.id === chatId) || chatList[0];
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);

        if (isDarkMode) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!value.startsWith(' ')) {
            setInputValue(value);
        }
    };

    const handleSubmit = async () => {
        if (!inputValue) return;

        const newMessages: IMessage = { text: inputValue, isUser: true };

        currentChat.messages.push(newMessages);

        const chatIndex = chatList.findIndex((chat) => chat.id === currentChat.id);

        setChatList((prevChatList) => {
            prevChatList.splice(chatIndex, 1, currentChat);
            return prevChatList;
        });
        setInputValue('');
        inputRef.current?.focus();
    };

    return (
        <div className="flex h-screen bg-white text-black dark:bg-[#1f2937] dark:text-white">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-dark-900 dark:text-white">Chat GPT</h1>

                    <button
                        className="py-1 px-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={toggleDarkMode}
                    >
                        {isDarkMode ? (
                            <svg
                                id="sun"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentcolor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        ) : (
                            <svg
                                id="moon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentcolor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                            </svg>
                        )}
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {/* Display chat history here */}
                    {chatList.map((chat, index) => (
                        <div
                            key={index}
                            className={`mb-2 rounded-lg p-2 cursor-pointer transition duration-300 ${
                                isDarkMode
                                    ? 'hover:bg-gray-700 hover:text-white'
                                    : 'hover:bg-gray-200 hover:text-gray-900'
                            } ${currentChat.id === chat.id ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''}`}
                            onClick={() => {
                                setChatId(chat.id);
                            }}
                        >
                            <p className="text-sm">{chat.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {currentChat.messages.length > 0 ? (
                    <div className="flex-1 overflow-y-auto p-4">
                        <MessageList messages={currentChat.messages} />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-2xl font-bold text-black dark:text-white">How can I help you today?</p>
                    </div>
                )}
                <div className="p-4 border-t border-gray-300 flex items-center">
                    <div className="w-full px-4 border border-gray-300 focus-within:border-gray-400 dark:border-gray-600 dark:focus-within:border-gray-500 rounded-md flex items-center justify-between">
                        <input
                            ref={inputRef}
                            type="text"
                            className="prompt flex-1 py-3 border-none outline-none dark:caret-gray-300 bg-transparent"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.which === 13) {
                                    handleSubmit();
                                }
                            }}
                        />

                        <button
                            className={`search-btn p-1 bg-gray-200 dark:bg-gray-700 rounded-lg ${
                                !inputValue
                                    ? 'cursor-default'
                                    : 'cursor-pointer transition duration-300 hover:scale-110 active:scale-90'
                            }`}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className={`${isDarkMode ? 'dark' : 'light'} text-gray-600/50 dark:text-gray-200/60`}
                                onClick={handleSubmit}
                            >
                                <path
                                    d="M7 11L12 6L17 11M12 18V7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
