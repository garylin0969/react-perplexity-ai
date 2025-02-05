import { useState } from 'react';
import { ConfigForm } from './components/ConfigForm';
import { ChatRoom } from './components/ChatRoom';
import { Message, PerplexityConfig } from './types/perplexity';
import { Footer } from './components/Footer';

export default function App() {
    const [config, setConfig] = useState<PerplexityConfig | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [token, setToken] = useState('');
    const [showToken, setShowToken] = useState(false);

    const handleSendMessage = async (content: string) => {
        if (!config || !token) return;

        const newMessage: Message = {
            role: 'user',
            content,
        };

        setMessages([...messages, newMessage]);

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...config,
                messages: [...config.messages, newMessage],
            }),
        };

        try {
            const response = await fetch('https://api.perplexity.ai/chat/completions', options);
            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: JSON.stringify(data),
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: JSON.stringify(err),
                },
            ]);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="flex-1 container mx-auto px-4 flex flex-col justify-center">
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
                        Perplexity AI Concat
                    </h1>

                    <div className="relative">
                        <input
                            type={showToken ? 'text' : 'password'}
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Enter your API token"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                                     bg-white dark:bg-gray-800 text-gray-800 dark:text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2
                                     text-gray-500 hover:text-gray-700 dark:text-gray-400
                                     dark:hover:text-gray-200 cursor-pointer"
                        >
                            {showToken ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-[640px]">
                            <ConfigForm onSubmit={setConfig} />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-[640px]">
                            <ChatRoom
                                messages={messages}
                                onSendMessage={handleSendMessage}
                                isConfigValid={!!config && !!token}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
