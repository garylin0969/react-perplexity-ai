import { useForm } from 'react-hook-form';
import { PerplexityConfig } from '../types/perplexity';
import { useState } from 'react';

interface Props {
    onSubmit: (config: PerplexityConfig) => void;
}

export const ConfigForm = ({ onSubmit }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        reset,
    } = useForm<PerplexityConfig>({
        defaultValues: {
            messages: [{ content: '', role: 'system' }],
            model: 'sonar',
            frequency_penalty: 1,
            max_tokens: 1024,
            presence_penalty: 0,
            return_images: false,
            return_related_questions: false,
            search_recency_filter: 'month',
            stream: false,
            temperature: 0.2,
            top_k: 0,
            top_p: 0.9,
            search_domain_filter: [],
        },
    });

    const [domainInput, setDomainInput] = useState('');

    const handleAddDomain = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const domain = domainInput.trim();
            if (domain) {
                const currentDomains = getValues('search_domain_filter') ?? [];
                if (currentDomains.length >= 3) {
                    return;
                }
                if (!currentDomains.includes(domain)) {
                    setValue('search_domain_filter', [...currentDomains, domain]);
                }
                setDomainInput('');
            }
        }
    };

    const handleRemoveDomain = (domainToRemove: string) => {
        const currentDomains = getValues('search_domain_filter') ?? [];
        setValue(
            'search_domain_filter',
            currentDomains.filter((domain) => domain !== domainToRemove)
        );
    };

    const handleReset = () => {
        reset();
        setDomainInput('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">API 設定</h2>
            </div>

            <form className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                <div className="space-y-4">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">model</label>
                        <select
                            {...register('model', { required: '請選擇模型' })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-600
                                     bg-gray-800 text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="sonar">sonar</option>
                            <option value="sonar-pro">sonar-pro</option>
                            <option value="sonar-reasoning">sonar-reasoning</option>
                            <option value="sonar-reasoning-pro">sonar-reasoning-pro</option>
                        </select>
                        {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model.message}</p>}
                        <p className="mt-1 text-sm text-gray-400">
                            選擇要使用的模型，不同模型有不同的上下文長度和能力。Pro 版本有更大的輸出限制(8k tokens)，
                            reasoning 版本會在回應中包含思考過程
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">temperature</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('temperature', {
                                required: '請輸入溫度值',
                                min: { value: 0, message: '最小值為 0' },
                                max: { value: 2, message: '最大值為 2' },
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-600
                                     bg-gray-800 text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.temperature && (
                            <p className="mt-1 text-sm text-red-500">{errors.temperature.message}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-400">
                            控制回應的隨機性，0-2之間。較高的值會產生更隨機的回應，較低的值會產生更確定性的回應
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">frequency_penalty</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('frequency_penalty', {
                                required: '請輸入頻率懲罰值',
                                min: { value: 0, message: '最小值為 0' },
                                max: { value: 2, message: '最大值為 2' },
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-600
                                     bg-gray-800 text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.frequency_penalty && (
                            <p className="mt-1 text-sm text-red-500">{errors.frequency_penalty.message}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-400">
                            必須大於 0 的乘法懲罰值。大於 1.0
                            的值會根據目前文本中的頻率懲罰新的標記，降低模型重複相同內容的可能性。1.0 表示無懲罰
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">presence_penalty</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('presence_penalty', {
                                required: '請輸入存在懲罰值',
                                min: { value: -2, message: '最小值為 -2' },
                                max: { value: 2, message: '最大值為 2' },
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-600
                                     bg-gray-800 text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.presence_penalty && (
                            <p className="mt-1 text-sm text-red-500">{errors.presence_penalty.message}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-400">
                            -2.0 到 2.0 之間的值。正值會根據標記是否出現在文本中進行懲罰，增加模型談論新主題的可能性
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">max_tokens</label>
                        <input
                            type="number"
                            {...register('max_tokens', {
                                min: { value: 1, message: '最小值為 1' },
                                max: { value: 4096, message: '最大值為 4096' },
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-600
                                     bg-gray-800 text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.max_tokens && <p className="mt-1 text-sm text-red-500">{errors.max_tokens.message}</p>}
                        <p className="mt-1 text-sm text-gray-400">回應的最大標記數量，1-4096之間。留空表示無限制</p>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">top_p</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('top_p', {
                                required: '請輸入 top_p 值',
                                min: { value: 0, message: '最小值為 0' },
                                max: { value: 1, message: '最大值為 1' },
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-600
                                     bg-gray-800 text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.top_p && <p className="mt-1 text-sm text-red-500">{errors.top_p.message}</p>}
                        <p className="mt-1 text-sm text-gray-400">
                            核採樣閾值，範圍在 0 到 1 之間。對於每個後續標記，模型會考慮具有 top_p
                            機率質量的標記結果。建議只調整 top_k 或 top_p 其中之一
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">top_k</label>
                        <input
                            type="number"
                            {...register('top_k', {
                                required: '請輸入 top_k 值',
                                min: { value: 0, message: '最小值為 0' },
                                max: { value: 2048, message: '最大值為 2048' },
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-600
                                     bg-gray-800 text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.top_k && <p className="mt-1 text-sm text-red-500">{errors.top_k.message}</p>}
                        <p className="mt-1 text-sm text-gray-400">
                            用於最高 top-k 過濾的標記數量，範圍在 0 到 2048 之間。設為 0 表示停用 top-k 過濾。建議只調整
                            top_k 或 top_p 其中之一
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">search_recency_filter</label>
                        <select
                            {...register('search_recency_filter')}
                            className="w-full px-3 py-2 rounded-lg border border-gray-600
                                     bg-gray-800 text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">無限制</option>
                            <option value="day">最近一天</option>
                            <option value="week">最近一週</option>
                            <option value="month">最近一個月</option>
                            <option value="year">最近一年</option>
                        </select>
                        {errors.search_recency_filter && (
                            <p className="mt-1 text-sm text-red-500">{errors.search_recency_filter.message}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-400">搜尋結果的時間範圍限制</p>
                    </div>

                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    {...register('return_images')}
                                    className="w-4 h-4 text-blue-500 border-gray-600 rounded
                                             focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-300">return_images</span>
                            </label>
                            <p className="mt-1 text-sm text-gray-400 ml-7">
                                決定是否在線上模型的回應中包含圖片（需要 Tier-2 權限）
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    {...register('return_related_questions')}
                                    className="w-4 h-4 text-blue-500 border-gray-600 rounded
                                             focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-300">return_related_questions</span>
                            </label>
                            <p className="mt-1 text-sm text-gray-400 ml-7">
                                決定是否在線上模型的回應中包含相關問題（需要 Tier-2 權限）
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    {...register('stream')}
                                    className="w-4 h-4 text-blue-500 border-gray-600 rounded
                                             focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-300">stream</span>
                            </label>
                            <p className="mt-1 text-sm text-gray-400 ml-7">
                                決定是否使用伺服器發送事件（SSE）以增量方式串流回應
                            </p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            search_domain_filter (Tier-3)
                        </label>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                onKeyDown={handleAddDomain}
                                placeholder="輸入網域後按 Enter 或空格新增（最多3個）"
                                disabled={(getValues('search_domain_filter') ?? []).length >= 3}
                                className="w-full px-3 py-2 rounded-lg border border-gray-600
                                         bg-gray-800 text-white
                                         focus:outline-none focus:ring-2 focus:ring-blue-500
                                         disabled:bg-gray-700"
                            />
                            <div className="flex flex-wrap gap-2">
                                {(getValues('search_domain_filter') ?? []).map((domain, index) => (
                                    <div
                                        key={index}
                                        className={`inline-flex items-center px-3 py-1 rounded-full
                                                 ${
                                                     domain.startsWith('-')
                                                         ? 'bg-red-100 text-red-700'
                                                         : 'bg-blue-100 text-blue-700'
                                                 }`}
                                    >
                                        <span className="text-sm">{domain}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDomain(domain)}
                                            className={`ml-2 cursor-pointer ${
                                                domain.startsWith('-')
                                                    ? 'text-red-600 hover:text-red-800'
                                                    : 'text-blue-600 hover:text-blue-800'
                                            }`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                            限制搜尋結果的來源網域（需要 Tier-3 權限）。最多可設定 3 個網域， 可使用 -
                            前綴設定黑名單（如：-example.com）。 白名單範例：example.com，黑名單範例：-example.com
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            系統訊息 (System Message)
                        </label>
                        <textarea
                            {...register('messages.0.content')}
                            className="w-full px-3 py-2 rounded-lg border border-gray-600
                                     bg-gray-800 text-white
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="輸入系統指令..."
                        />
                        <input type="hidden" {...register('messages.0.role')} value="system" />
                        <p className="mt-1 text-sm text-gray-400">設定系統指令來定義 AI 的行為和限制</p>
                    </div>
                </div>
            </form>

            <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex gap-4">
                    <button
                        type="button"
                        className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-medium cursor-pointer
                                 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500
                                 transition-colors duration-200"
                        onClick={handleReset}
                    >
                        重置設定
                    </button>
                    <button
                        type="button"
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium cursor-pointer
                                 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                                 transition-colors duration-200"
                        onClick={handleSubmit(onSubmit)}
                    >
                        儲存設定
                    </button>
                </div>
            </div>
        </div>
    );
};
