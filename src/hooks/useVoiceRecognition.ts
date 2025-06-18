import { useState, useEffect, useCallback } from 'react';
import { VoiceRecognitionState } from '../types';

/**
 * 语音识别钩子
 */
const useVoiceRecognition = () => {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    error: null
  });

  // 检查浏览器是否支持语音识别
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  // 获取语音识别构造函数
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition: any = null;

  if (isSupported) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';
  }

  // 开始监听
  const startListening = useCallback(() => {
    if (!isSupported) {
      setState(prev => ({
        ...prev,
        error: '您的浏览器不支持语音识别功能'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isListening: true,
      transcript: '',
      error: null
    }));

    try {
      recognition.start();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isListening: false,
        error: '无法启动语音识别'
      }));
    }
  }, [isSupported, recognition]);

  // 停止监听
  const stopListening = useCallback(() => {
    if (!isSupported || !state.isListening) return;

    setState(prev => ({
      ...prev,
      isListening: false
    }));

    try {
      recognition.stop();
    } catch (error) {
      console.error('停止语音识别时出错:', error);
    }
  }, [isSupported, state.isListening, recognition]);

  // 清除记录
  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: ''
    }));
  }, []);

  // 设置事件监听器
  useEffect(() => {
    if (!isSupported) return;

    const handleResult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: finalTranscript || interimTranscript
      }));
    };

    const handleError = (event: any) => {
      setState(prev => ({
        ...prev,
        error: event.error || '语音识别过程中发生错误',
        isListening: false
      }));
    };

    const handleEnd = () => {
      if (state.isListening) {
        try {
          recognition.start();
        } catch (error) {
          setState(prev => ({
            ...prev,
            isListening: false
          }));
        }
      }
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;

    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        
        if (state.isListening) {
          recognition.stop();
        }
      }
    };
  }, [isSupported, state.isListening, recognition]);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  };
};

export default useVoiceRecognition; 