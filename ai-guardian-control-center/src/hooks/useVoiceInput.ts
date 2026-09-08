import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API interface declarations for TypeScript compatibility without @ts-ignore
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
}

export interface UseVoiceInputOptions {
  defaultLanguage?: string;
  onTranscriptComplete?: (finalText: string) => void;
}

export interface UseVoiceInputReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  selectedLanguage: string;
  setLanguage: (lang: string) => void;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  clearError: () => void;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
];

export const useVoiceInput = (options?: UseVoiceInputOptions): UseVoiceInputReturn => {
  const { defaultLanguage = 'en-IN', onTranscriptComplete } = options || {};

  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(defaultLanguage);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isManuallyStoppingRef = useRef<boolean>(false);
  const finalAccumulatorRef = useRef<string>('');
  const onCompleteCallbackRef = useRef(onTranscriptComplete);

  useEffect(() => {
    onCompleteCallbackRef.current = onTranscriptComplete;
  }, [onTranscriptComplete]);

  // Check Web Speech API browser availability
  const isSupported = typeof window !== 'undefined' && Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  // Stop listening helper
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isManuallyStoppingRef.current = true;
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('SpeechRecognition stop error:', err);
      }
    }
    setIsListening(false);
  }, []);

  // Reset transcripts
  const resetTranscript = useCallback(() => {
    setInterimTranscript('');
    setFinalTranscript('');
    finalAccumulatorRef.current = '';
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setSelectedLanguage(lang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, []);

  // Start listening helper
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Voice input isn't supported in this browser. You can continue using text commands.");
      return;
    }

    // If already running, stop previous instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    setError(null);
    setInterimTranscript('');
    setFinalTranscript('');
    finalAccumulatorRef.current = '';
    isManuallyStoppingRef.current = false;

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      const recognition: SpeechRecognitionInstance = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let currentFinalPart = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            currentFinalPart += text + ' ';
          } else {
            currentInterim += text;
          }
        }

        if (currentFinalPart) {
          finalAccumulatorRef.current = (finalAccumulatorRef.current + currentFinalPart).trim() + ' ';
          setFinalTranscript(finalAccumulatorRef.current.trim());
        }

        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('SpeechRecognition error:', event.error);
        if (isManuallyStoppingRef.current && (event.error === 'aborted' || event.error === 'no-speech')) {
          return;
        }

        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            setError('Microphone permission is required for voice commands. Please allow microphone access in your browser settings.');
            break;
          case 'audio-capture':
            setError('No microphone was found or microphone is currently in use by another application.');
            break;
          case 'network':
            setError('Network connection error during speech recognition. Please check your internet connection.');
            break;
          case 'no-speech':
            // If user was silent for a while
            setError('No speech was detected. Please click the microphone and try speaking again.');
            break;
          case 'aborted':
            // Silent abort
            break;
          default:
            setError(`Speech recognition error (${event.error}). Please try again or use keyboard input.`);
            break;
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        const accumulated = finalAccumulatorRef.current.trim();
        if (accumulated && onCompleteCallbackRef.current) {
          onCompleteCallbackRef.current(accumulated);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to initialize SpeechRecognition:', err);
      setError('Could not access speech recognition service. Please check microphone permissions.');
      setIsListening(false);
    }
  }, [isSupported, selectedLanguage]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const fullTranscript = (finalTranscript + (interimTranscript ? ` ${interimTranscript}` : '')).trim();

  return {
    isSupported,
    isListening,
    transcript: fullTranscript,
    interimTranscript,
    finalTranscript,
    error,
    selectedLanguage,
    setLanguage,
    startListening,
    stopListening,
    resetTranscript,
    clearError,
  };
};
