import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';

const token = '';

function App() {
    const [responseData, setResponseData] = useState('');

    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: FieldValues) => {
        console.log(data);

        if (!data.content) {
            return;
        }

        const options = {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'sonar',
                messages: [
                    {
                        role: 'system',
                        content:
                            '絕對優先使用鉅亨、news.cnyes.com、www.cnyes.com的資料,若沒有再參考其他,回復內容不用說參考了哪裡的資料',
                    },
                    { role: 'user', content: data.content },
                ],
                temperature: 0.2,
                top_p: 0.9,
                search_domain_filter: ['www.cnyes.com', 'news.cnyes.com'],
                return_images: false,
                return_related_questions: false,
                search_recency_filter: 'month',
                top_k: 0,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 1,
                response_format: null,
            }),
        };

        await fetch('https://api.perplexity.ai/chat/completions', options)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                let content = response.choices[0].message.content;

                // 使用正則表達式移除 [1]、[2] 等引用標註
                content = content.replace(/\[\d+\]/g, '');
                setResponseData(content);
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-1/2">
                <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                        rows={3}
                        className="border w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                        {...register('content')}
                    />
                    <button
                        className="cursor-pointer inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
                <p className="mt-4">{responseData}</p>
            </div>
        </div>
    );
}

export default App;
