export interface PerplexityConfig {
    messages: Message[];
    model: string;
    frequency_penalty: number;
    max_tokens: number;
    presence_penalty: number;
    return_images: boolean;
    return_related_questions: boolean;
    search_recency_filter: string;
    stream: boolean;
    temperature: number;
    top_k: number;
    top_p: number;
    search_domain_filter: string[];
}

export interface Message {
    content: string;
    role: 'system' | 'user' | 'assistant';
}

export interface ResponseFormat {
    type: 'text' | 'json_object';
}
