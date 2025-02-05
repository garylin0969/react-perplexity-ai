export const Footer = () => {
    return (
        <footer className="py-6 px-4 mt-6 border-t dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center mb-4 sm:mb-0 space-x-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Powered by{' '}
                        <a
                            href="https://docs.perplexity.ai/home"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 transition-colors font-medium hover:underline"
                        >
                            Perplexity API
                        </a>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Developed by{' '}
                        <a
                            href="https://github.com/garylin0969/react-perplexity-concat"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 transition-colors font-medium hover:underline"
                        >
                            Gary Lin
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
