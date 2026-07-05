import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-6 font-['Cairo']" dir="rtl">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-red-200">
                        <div className="flex items-center gap-4 text-red-600 mb-6">
                            <span className="text-4xl">⚠️</span>
                            <div>
                                <h1 className="text-2xl font-black">حدث خطأ غير متوقع في النظام</h1>
                                <p className="text-gray-500 text-sm mt-1">توقف التطبيق عن العمل بسبب مشكلة برمجية في المتصفح.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-150 mb-6 overflow-auto max-h-60 text-left font-mono text-xs text-red-700" dir="ltr">
                            <p className="font-bold mb-2">{this.state.error && this.state.error.toString()}</p>
                            <pre className="whitespace-pre-wrap">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => window.location.reload()} 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200"
                            >
                                تحديث الصفحة 🔄
                            </button>
                            <button 
                                onClick={() => window.location.href = '/'} 
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 px-6 rounded-xl transition duration-200"
                            >
                                العودة للصفحة الرئيسية 🏠
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
