import { useState, useRef, useEffect } from 'react';
import { Message } from '../types/perplexity';
import ReactJson from 'react-json-view';

interface Props {
    messages: Message[];
    onSendMessage: (content: string) => void;
    isConfigValid: boolean;
}

export const ChatRoom = ({ messages, onSendMessage, isConfigValid }: Props) => {
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && isConfigValid) {
            setIsLoading(true);
            await onSendMessage(newMessage);
            setNewMessage('');
            setIsLoading(false);
        }
    };

    const formatMessage = (content: string, role: string) => {
        if (role === 'user') {
            return <p className="text-sm">{content}</p>;
        }

        try {
            const jsonContent = JSON.parse(content);
            return (
                <div className="max-w-full overflow-x-auto">
                    <ReactJson
                        src={jsonContent}
                        theme="monokai"
                        displayDataTypes={false}
                        enableClipboard={false}
                        style={{
                            background: 'transparent',
                            padding: '0.5rem',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}
                        collapsed={2}
                        name={null}
                    />
                </div>
            );
        } catch {
            return <p className="text-sm">{content}</p>;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">聊天室</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[90%] rounded-lg p-3 ${
                                message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white font-mono'
                            }`}
                        >
                            {formatMessage(message.content, message.role)}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[90%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700 dark:text-white">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isConfigValid ? '輸入訊息...' : '請先完成設定...'}
                        disabled={!isConfigValid || isLoading}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                                 bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                                 focus:outline-none focus:ring-2 focus:ring-blue-500
                                 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    />
                    <button
                        type="submit"
                        disabled={!isConfigValid || isLoading}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium cursor-pointer
                                 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                                 disabled:bg-gray-400 disabled:cursor-not-allowed
                                 transition-colors duration-200"
                    >
                        {isLoading ? '等待回應...' : '發送'}
                    </button>
                </form>
            </div>
        </div>
    );
};
