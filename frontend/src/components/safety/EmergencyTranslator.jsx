import { FaExchangeAlt } from 'react-icons/fa';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

export default function EmergencyTranslator() {
  const {
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
    inputText,
    setInputText,
    translatedText,
    isTranslating,
    error: translateError,
    copied,
    swapLanguages,
    copyTranslation,
    LANGUAGES,
  } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        {/* Source Language Panel */}
        <div className="flex-1 w-full flex flex-col bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-white p-3 border-b border-slate-200">
            <select
              id="source-lang-select"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="h-7 sm:h-5 w-full border border-black bg-white px-2 text-xs font-normal rounded"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4 flex-1 min-h-[140px] relative bg-slate-50">
            <textarea
              id="translate-input"
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-full bg-transparent resize-none outline-none text-slate-700 text-sm"
              maxLength={500}
            />
            {inputText && (
              <span className="absolute bottom-4 left-4 text-[11px] text-slate-400">
                {inputText.length}/500
              </span>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <button
          id="swap-languages-btn"
          onClick={swapLanguages}
          className="flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all self-center"
          title="Swap languages"
        >
          <FaExchangeAlt size={18} />
        </button>

        {/* Target Language Panel */}
        <div className="flex-1 w-full flex flex-col bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-white p-3 border-b border-slate-200">
            <select
              id="target-lang-select"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="h-7 sm:h-5 w-full border border-black bg-white px-2 text-xs font-normal rounded"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4 flex-1 min-h-[140px] relative bg-slate-50">
            {/* Translation Output */}
            {isTranslating ? (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="h-4 w-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                Translating...
              </div>
            ) : translateError ? (
              <div className="text-sm text-red-500">{translateError}</div>
            ) : translatedText ? (
              <div className="w-full h-full text-slate-700 text-sm whitespace-pre-wrap">{translatedText}</div>
            ) : (
              <div className="w-full h-full text-slate-400 text-sm">Translation will appear here...</div>
            )}

            {/* Copy Button */}
            {translatedText && !isTranslating && (
              <button
                id="copy-translation-btn"
                onClick={copyTranslation}
                className={`absolute bottom-4 right-4 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-all ${copied
                    ? 'bg-green-100 text-green-700'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                title="Copy translation"
              >
                {copied ? <><FiCheck size={14} /> Copied!</> : <><FiCopy size={14} /> Copy</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
