import React from 'react';

export interface IProps {
    text: string;
    isUser: boolean;
}

const Message = ({ text, isUser }: IProps) => {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-xs mx-2 px-4 py-2 rounded-lg shadow-md ${
                    isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
                }`}
            >
                <p>{text}</p>
            </div>
        </div>
    );
};

export default Message;
