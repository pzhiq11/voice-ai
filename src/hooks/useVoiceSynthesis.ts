import { useState, useEffect, useCallback } from 'react';
import { VoiceSynthesisState, AppSettings } from '../types';

interface UseVoiceSynthesisProps {
  settings?: Partial<AppSettings>;
}

/**
 * 语音合成钩子
 */
const useVoiceSynthesis = ({ settings }: UseVoiceSynthesisProps = {}) => {
  const [state, setState] = useState<VoiceSynthesisState>({
    isSpeaking: false,
    error: null
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);

  // 检查浏览器是否支持语音合成
  const isSupported = 'speechSynthesis' in window;

  // 获取可用语音列表
  const loadVoices = useCallback(() => {
    if (!isSupported) return;

    const availableVoices = window.speechSynthesis.getVoices();
    
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
      
      // 设置默认语音（优先中文）
      const preferredVoice = settings?.preferredVoice;
      const defaultVoice = availableVoices.find(voice => 
        preferredVoice ? voice.name === preferredVoice : voice.lang.includes('zh')
      ) || availableVoices[0];
      
      setCurrentVoice(defaultVoice);
    }
  }, [isSupported, settings?.preferredVoice]);

  // 初始化和监听语音变化
  useEffect(() => {
    if (!isSupported) return;

    loadVoices();

    // Chrome需要监听voiceschanged事件
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (isSupported) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported, loadVoices]);

  // 语音朗读
  const speak = useCallback((text: string) => {
    if (!isSupported) {
      setState(prev => ({
        ...prev,
        error: '您的浏览器不支持语音合成功能'
      }));
      return;
    }

    // 先清除所有待朗读内容并停止当前朗读
    window.speechSynthesis.cancel();

    // 如果文本为空，不继续处理
    if (!text || text.trim() === '') {
      return;
    }

    setState(prev => ({
      ...prev,
      isSpeaking: true,
      error: null
    }));

    try {
      // 创建新的朗读实例
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 设置语音
      if (currentVoice) {
        utterance.voice = currentVoice;
      }
      
      // 应用设置
      if (settings) {
        if (settings.voiceRate !== undefined) utterance.rate = settings.voiceRate;
        if (settings.voicePitch !== undefined) utterance.pitch = settings.voicePitch;
        if (settings.voiceVolume !== undefined) utterance.volume = settings.voiceVolume;
      }
      
      // 设置事件处理
      utterance.onend = () => {
        setState(prev => ({
          ...prev,
          isSpeaking: false
        }));
      };
      
      utterance.onerror = (event) => {
        // 如果是中断错误，不显示错误信息
        if (event.error === 'interrupted') {
          setState(prev => ({
            ...prev,
            isSpeaking: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            isSpeaking: false,
            error: '语音合成过程中发生错误'
          }));
          console.error('语音合成错误:', event);
        }
      };
      
      // 确保语音合成服务处于活动状态
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      
      window.speechSynthesis.speak(utterance);
      
      // 在Chrome中，如果页面处于后台，语音合成可能会暂停
      // 这个解决方案可以保持合成的持续进行
      const intervalId = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(intervalId);
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSpeaking: false,
        error: '语音合成过程中发生错误'
      }));
      console.error('语音合成错误:', error);
    }
  }, [isSupported, currentVoice, settings]);

  // 停止朗读
  const stop = useCallback(() => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    
    setState(prev => ({
      ...prev,
      isSpeaking: false
    }));
  }, [isSupported]);

  // 暂停朗读
  const pause = useCallback(() => {
    if (!isSupported || !state.isSpeaking) return;
    
    window.speechSynthesis.pause();
    
    setState(prev => ({
      ...prev,
      isSpeaking: false
    }));
  }, [isSupported, state.isSpeaking]);

  // 恢复朗读
  const resume = useCallback(() => {
    if (!isSupported) return;
    
    window.speechSynthesis.resume();
    
    setState(prev => ({
      ...prev,
      isSpeaking: true
    }));
  }, [isSupported]);

  // 切换语音
  const changeVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);

  return {
    ...state,
    voices,
    currentVoice,
    speak,
    stop,
    pause,
    resume,
    changeVoice,
    isSupported
  };
};

export default useVoiceSynthesis; 