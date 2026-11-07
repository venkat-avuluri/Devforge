import React, { useState } from 'react';
import api from '../api/axios';
import { Sparkles, Loader2, Check, AlertCircle, X, Wand2 } from 'lucide-react';

const promptPresets = [
  'Technical fest for AI and Data Science students with a 24-hr hackathon, workshops and coding competition.',
  'Annual Inter-College Cultural Fest featuring battle of bands, dance showdown, fashion gala, and star pro-nite.',
  'National Student Research Conference on Cloud Computing, Cybersecurity, and Emerging Technologies.',
  'Hands-on full-day workshop on Full-Stack Next.js, Docker, and AI APIs with live deployment.',
];

const AiGeneratorModal = ({ isOpen, onClose, onApply, currentTitle, currentCategory }) => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState(currentCategory || 'Technical Fest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedData, setGeneratedData] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (customPrompt) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) {
      setError('Please provide a short description or pick a preset prompt.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/ai/generate-content', {
        prompt: textToUse,
        title: currentTitle,
        category,
      });

      if (res.data.success) {
        setGeneratedData(res.data.data);
      } else {
        setError(res.data.message || 'Failed to generate content');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with AI service');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedData) {
      onApply(generatedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">AI Event Content Generator</h3>
              <p className="text-xs text-indigo-100">
                Generate professional descriptions, schedules, speakers & FAQs in seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Describe your event or goals
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 24-hour national hackathon for engineering students focusing on web3, artificial intelligence, and real-world problem statements..."
              className="w-full text-sm p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none resize-none"
            />
          </div>

          {/* Presets */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Or pick an idea preset:
            </span>
            <div className="flex flex-col gap-1.5">
              {promptPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(p);
                    handleGenerate(p);
                  }}
                  className="text-left text-xs p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80 transition flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{p}</span>
                  <Wand2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Technical Fest">Technical Fest</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Conference">Conference</option>
              <option value="Cultural">Cultural</option>
              <option value="Competition">Competition</option>
              <option value="Seminar">Seminar</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          {/* Generated Result Preview */}
          {generatedData && (
            <div className="mt-4 p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Generated Preview Ready
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold uppercase bg-white px-2 py-0.5 rounded border border-indigo-200">
                  {generatedData.source === 'gemini' ? 'Google Gemini AI' : 'Smart Fallback Engine'}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-semibold">Suggested Title</p>
                <p className="font-bold text-slate-900 text-sm">{generatedData.title}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-semibold">Tagline</p>
                <p className="text-xs text-slate-700 italic">"{generatedData.tagline}"</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-semibold">Description Snippet</p>
                <p className="text-xs text-slate-600 line-clamp-3">{generatedData.description}</p>
              </div>

              <div className="text-xs text-indigo-700 flex items-center gap-3 pt-1">
                <span>✓ {generatedData.schedule?.length || 0} Schedule items</span>
                <span>✓ {generatedData.speakers?.length || 0} Speakers</span>
                <span>✓ {generatedData.faqs?.length || 0} FAQs</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          {!generatedData ? (
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Event...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Event Builder</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiGeneratorModal;
