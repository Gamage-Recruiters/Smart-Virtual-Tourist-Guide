import { useState, useEffect, useRef, useCallback } from 'react';
import { translateText, SUPPORTED_LANGUAGES } from '../services/translateService';

/**
 * Custom hook for managing translation state with debounced auto-translate.
 *
 * Features:
 * - Debounced translation (500ms after user stops typing)
 * - Swap languages with one click
 * - Copy translation to clipboard with visual feedback
 * - Loading, error, and empty states
 *
 * @returns {object} Translation state and handlers
 */
export function useTranslation() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('si');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Ref to track the latest debounce timer
  const debounceRef = useRef(null);
  // Ref to track latest request and discard stale responses
  const requestIdRef = useRef(0);

  // ── Debounced Auto-Translate ─────────────────────────────────────────────────
  useEffect(() => {
    // Clear any previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If input is empty, reset output immediately
    if (!inputText.trim()) {
      setTranslatedText('');
      setError(null);
      setIsTranslating(false);
      return;
    }

    // Set translating state immediately for UI feedback
    setIsTranslating(true);
    setError(null);

    // Debounce: wait 500ms after user stops typing
    debounceRef.current = setTimeout(async () => {
      const currentRequestId = ++requestIdRef.current;

      try {
        const result = await translateText(inputText, sourceLang, targetLang);

        // Only update if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setTranslatedText(result);
          setError(null);
        }
      } catch (err) {
        if (currentRequestId === requestIdRef.current) {
          setError(err.message || 'Translation failed. Please try again.');
          setTranslatedText('');
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsTranslating(false);
        }
      }
    }, 500);

    // Cleanup on unmount or re-render
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputText, sourceLang, targetLang]);

  // ── Swap Languages ───────────────────────────────────────────────────────────
  const swapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    // Move translated text to input and vice versa
    setInputText(translatedText);
    setTranslatedText(inputText);
  }, [sourceLang, targetLang, inputText, translatedText]);

  // ── Copy Translation to Clipboard ────────────────────────────────────────────
  const copyTranslation = useCallback(async () => {
    if (!translatedText) return;

    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = translatedText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [translatedText]);

  return {
    // State
    sourceLang,
    targetLang,
    inputText,
    translatedText,
    isTranslating,
    error,
    copied,

    // Setters
    setSourceLang,
    setTargetLang,
    setInputText,

    // Actions
    swapLanguages,
    copyTranslation,

    // Data
    LANGUAGES: SUPPORTED_LANGUAGES,
  };
}
