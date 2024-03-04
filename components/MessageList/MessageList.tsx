import React from 'react';
import Message from '@/components/Message';
import { IMessage } from '@/shared/message';

interface IProps {
    messages: IMessage[];
}

const MessageList = ({ messages }: IProps) => {
    return (
        <div className={`flex flex-col h-screen overflow-y-auto p-4`}>
            {messages.map((message, index) => (
                <Message key={index} text={message.text} isUser={message.isUser} />
            ))}
        </div>
    );
};

export default MessageList;
