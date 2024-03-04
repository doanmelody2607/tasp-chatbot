export interface IMessage {
    text: string;
    isUser: boolean;
}

export interface IChatHistory {
    id: number;
    title: string;
    messages: IMessage[]
}