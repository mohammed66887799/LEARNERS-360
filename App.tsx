import React, { useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import ResultsDisplay from './components/ResultsDisplay';
import { AnalysisState } from './types';
import { analyzePlantImage } from './services/geminiService';
import { Loader2, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    imagePreview: null,
    result: null,
    error: null,
  });

  const handleFileSelect = async (file: File) => {
    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    
    setState(prev => ({
      ...prev,
      status: 'analyzing',
      imagePreview: objectUrl,
      error: null,
      result: null
    }));

    try {
      const diagnosis = await analyzePlantImage(file);
      setState(prev => ({
        ...prev,
        status: 'success',
        result: diagnosis,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: err.message || "An unexpected error occurred."
      }));
    }
  };

  const handleReset = () => {
    setState({
      status: 'idle',
      imagePreview: null,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-emerald-50/50 font-sans text-slate-900 pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Text - Only show when idle */}
        {state.status === 'idle' && (
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Identify Plant Diseases <span className="text-emerald-600">Instantly</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload a photo of your plant leaf to get an immediate AI diagnosis, confidence score, and treatment recommendations.
            </p>
          </div>
        )}

        {/* Upload Area - Hide if success to focus on results */}
        {state.status !== 'success' && (
          <UploadArea 
            onFileSelect={handleFileSelect} 
            isAnalyzing={state.status === 'analyzing'} 
          />
        )}

        {/* Analysis Loading State */}
        {state.status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white mb-6">
                 {state.imagePreview && (
                   <img src={state.imagePreview} alt="Analyzing" className="w-full h-full object-cover" />
                 )}
                 <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[2px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                 </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">Analyzing Leaf Structure...</h3>
            <p className="text-slate-500">Our AI is examining patterns for disease indicators.</p>
          </div>
        )}

        {/* Error State */}
        {state.status === 'error' && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <p className="text-red-700 font-medium mb-4">{state.error}</p>
            <button 
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 bg-white border border-red-300 rounded-lg text-red-700 hover:bg-red-50 font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {state.status === 'success' && state.result && (
          <div className="relative">
             <div className="absolute -top-16 right-0">
                <button 
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 bg-white shadow-sm border border-slate-200 rounded-full text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md transition-all text-sm font-medium"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Analyze Another
                </button>
             </div>
             
             <div className="flex flex-col md:flex-row gap-8 items-start">
                 {/* Sidebar Image - Only visible on Desktop for layout balance */}
                 <div className="hidden md:block w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                            {state.imagePreview && (
                                <img src={state.imagePreview} alt="Analyzed Leaf" className="w-full h-auto object-cover" />
                            )}
                        </div>
                        <p className="text-center text-xs text-slate-400 mt-2">Original Image</p>
                    </div>
                 </div>

                 {/* Mobile Image */}
                 <div className="md:hidden w-32 h-32 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-white mb-6">
                    {state.imagePreview && (
                        <img src={state.imagePreview} alt="Analyzed Leaf" className="w-full h-full object-cover" />
                    )}
                 </div>

                 <div className="flex-grow w-full">
                    <ResultsDisplay result={state.result} />
                 </div>
             </div>
          </div>
        )}

      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} AgroDetect. Powered by Gemini Flash.</p>
      </footer>
    </div>
  );
};

export default App;