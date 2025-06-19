import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceRecognitionState } from '../types';

// 定义SpeechRecognition接口
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * 语音识别钩子
 */
const useVoiceRecognition = () => {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    error: null
  });

  // 使用ref保存transcript，确保在回调中能访问到最新值
  const transcriptRef = useRef<string>('');
  
  // 标记麦克风权限状态
  const hasMicrophonePermission = useRef<boolean | null>(null);
  
  // 检查浏览器是否支持语音识别
  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // 获取语音识别构造函数
  const SpeechRecognition = isSupported ? 
    (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  
  // 存储recognition实例
  const recognitionRef = useRef<any>(null);
  
  // 跟踪recognition的实际状态
  const isRecognitionActiveRef = useRef<boolean>(false);

  // 创建新的recognition实例
  const createRecognitionInstance = useCallback(() => {
    try {
      // 清理旧实例
      if (recognitionRef.current) {
        try {
          const recognition = recognitionRef.current;
          recognition.onresult = null;
          recognition.onerror = null;
          recognition.onend = null;
          
          if (isRecognitionActiveRef.current) {
            recognition.abort();
          }
        } catch (e) {
          // 忽略清理错误
        }
      }
      
      // 创建新实例
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'zh-CN';
        
        isRecognitionActiveRef.current = false;
        return true;
      }
      return false;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: '创建语音识别实例失败'
      }));
      return false;
    }
  }, [SpeechRecognition]);

  // 检查麦克风权限
  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 获取到权限后停止所有音轨
      stream.getTracks().forEach(track => track.stop());
      
      hasMicrophonePermission.current = true;
      return true;
    } catch (error) {
      hasMicrophonePermission.current = false;
      setState(prev => ({
        ...prev,
        error: '无法访问麦克风，请检查浏览器权限设置'
      }));
      return false;
    }
  }, []);

  // 初始化语音识别实例
  useEffect(() => {
    if (!isSupported) return;
    
    // 初始检查权限
    checkMicrophonePermission();
    
    // 初始创建recognition实例
    createRecognitionInstance();
    
    return () => {
      // 组件卸载时清理
      if (recognitionRef.current) {
        try {
          const recognition = recognitionRef.current;
          recognition.onresult = null;
          recognition.onerror = null;
          recognition.onend = null;
          
          if (isRecognitionActiveRef.current) {
            recognition.abort();
            isRecognitionActiveRef.current = false;
          }
        } catch (e) {
          // 忽略清理错误
        }
      }
    };
  }, [isSupported, checkMicrophonePermission, createRecognitionInstance]);

  // 开始监听
  const startListening = useCallback(async () => {
    if (!isSupported) {
      setState(prev => ({
        ...prev,
        error: '您的浏览器不支持语音识别功能'
      }));
      return;
    }
    
    // 如果已经在监听，先停止
    if (isRecognitionActiveRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        isRecognitionActiveRef.current = false;
      } catch (e) {
        // 忽略停止错误
      }
    }
    
    // 每次开始前重新创建实例，避免状态问题
    const instanceCreated = createRecognitionInstance();
    if (!instanceCreated) {
      setState(prev => ({
        ...prev,
        error: '无法创建语音识别实例'
      }));
      return;
    }
    
    // 如果还没有检查过权限，先检查
    if (hasMicrophonePermission.current === null) {
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) return;
    } else if (hasMicrophonePermission.current === false) {
      setState(prev => ({
        ...prev,
        error: '无法访问麦克风，请检查浏览器权限设置'
      }));
      return;
    }
    
    // 重置transcript
    transcriptRef.current = '';
    setState(prev => ({
      ...prev,
      isListening: true,
      transcript: '',
      error: null
    }));

    try {
      if (recognitionRef.current) {
        // 设置事件处理程序
        const recognition = recognitionRef.current;
        
        recognition.onresult = (event: any) => {
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

          // 保存结果到ref和state
          const resultText = finalTranscript || interimTranscript;
          if (resultText) {
            transcriptRef.current = resultText;
            setState(prev => ({
              ...prev,
              transcript: resultText
            }));
          }
        };
        
        recognition.onerror = (event: any) => {
          // 检查是否是无声音错误，这种情况不显示为错误
          if (event.error === 'no-speech') {
            return;
          }
          
          // 如果是权限错误，更新权限状态
          if (event.error === 'not-allowed') {
            hasMicrophonePermission.current = false;
          }
          
          setState(prev => ({
            ...prev,
            error: event.error === 'not-allowed' 
              ? '无法访问麦克风，请检查浏览器权限设置' 
              : (event.error || '语音识别过程中发生错误'),
            isListening: false
          }));
          
          isRecognitionActiveRef.current = false;
        };
        
        recognition.onend = () => {
          // 使用ref中保存的transcript更新state
          setState(prev => ({
            ...prev,
            isListening: false,
            transcript: transcriptRef.current
          }));
          
          isRecognitionActiveRef.current = false;
        };
        
        // 开始识别
        recognition.start();
        isRecognitionActiveRef.current = true;
      } else {
        throw new Error('语音识别实例未初始化');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isListening: false,
        error: '无法启动语音识别'
      }));
      isRecognitionActiveRef.current = false;
    }
  }, [isSupported, checkMicrophonePermission, createRecognitionInstance]);

  // 停止监听
  const stopListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    
    try {
      const recognition = recognitionRef.current;
      
      // 首先暂存当前的transcript
      const currentTranscript = transcriptRef.current;
      
      // 停止语音识别
      if (isRecognitionActiveRef.current) {
        recognition.stop();
        isRecognitionActiveRef.current = false;
      }
      
      // 确保state更新为非监听状态
      setState(prev => ({
        ...prev,
        isListening: false,
        // 使用当前的transcript更新state
        transcript: currentTranscript || prev.transcript
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isListening: false
      }));
      isRecognitionActiveRef.current = false;
    }
  }, [isSupported]);

  // 清除记录
  const resetTranscript = useCallback(() => {
    transcriptRef.current = '';
    setState(prev => ({
      ...prev,
      transcript: ''
    }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  };
};

export default useVoiceRecognition; 