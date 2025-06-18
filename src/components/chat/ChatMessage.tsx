import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { UserIcon, CpuChipIcon, PlayCircleIcon, StopCircleIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/helpers';
import { ChatMessage as ChatMessageType } from '../../types';
import useVoiceSynthesis from '../../hooks/useVoiceSynthesis';
import useSettingsStore from '../../store/settingsStore';

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const { settings } = useSettingsStore();
  const isUser = message.role === 'user';
  const isLoading = message.isLoading;
  
  // 打字机效果状态
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const {
    isSpeaking,
    speak,
    stop
  } = useVoiceSynthesis({ settings });
  
  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(message.content);
    }
  };
  
  // 打字机效果
  useEffect(() => {
    if (isUser || isLoading || !message.content) {
      setDisplayText(message.content || '');
      return;
    }

    // 重置状态，准备开始打字效果
    setDisplayText('');
    setIsTyping(true);
    
    const text = message.content;
    const totalLength = text.length;
    let currentIndex = 0;
    
    // 清除之前的任何定时器
    const timers: NodeJS.Timeout[] = [];
    
    // 模拟打字速度 (每个字符约50ms)
    const typeNextChar = () => {
      if (currentIndex < totalLength) {
        const timer = setTimeout(() => {
          setDisplayText(text.substring(0, currentIndex + 1));
          currentIndex++;
          typeNextChar();
        }, 30); // 调整这个数值可以改变打字速度
        timers.push(timer);
      } else {
        setIsTyping(false);
      }
    };
    
    // 开始打字效果
    typeNextChar();
    
    // 清理函数
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      setIsTyping(false);
    };
  }, [message.content, isUser, isLoading]);

  // 自动朗读最后一条AI消息（如果设置了自动播放）
  useEffect(() => {
    // 创建一个延迟定时器，防止快速连续请求
    let speechTimer: NodeJS.Timeout;

    // 只有当打字效果完成后才开始语音播放
    if (
      isLast && 
      !isUser && 
      !isLoading && 
      !isTyping &&
      settings.autoPlayVoice && 
      settings.voiceEnabled &&
      message.content
    ) {
      // 延迟200毫秒再开始语音合成，以避免快速连续请求
      speechTimer = setTimeout(() => {
        // speak(message.content);
      }, 200);
    }

    // 组件卸载时清除定时器
    return () => {
      if (speechTimer) {
        clearTimeout(speechTimer);
      }
    };
  }, [isLast, isUser, isLoading, isTyping, speak, message.content, settings.autoPlayVoice, settings.voiceEnabled]);
  
  return (
    <div
      className={clsx(
        'mb-6 animate-fade-in flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={clsx(
        "flex items-start gap-3 max-w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* 头像 */}
        <div
          className={clsx(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-secondary-500 text-white'
          )}
        >
          {isUser ? <UserIcon className="h-5 w-5" /> : <CpuChipIcon className="h-5 w-5" />}
        </div>
        
        {/* 消息内容 */}
        <div
          className={clsx(
            'rounded-xl px-4 py-3 max-w-[85%] sm:max-w-[75%]',
            isUser
              ? 'bg-primary-600/80 text-white rounded-tr-none'
              : 'bg-dark-800 text-white rounded-tl-none',
            isLoading && 'animate-pulse'
          )}
        >
          {/* 消息文字 */}
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="text-dark-400 ml-2">AI正在思考...</span>
            </div>
          ) : (
            <div>
              <p className={`whitespace-pre-wrap break-words ${isUser ? '' : 'ai-message-animation'}`}>
                {isUser ? message.content : displayText}
                {!isUser && isTyping && <span className="cursor-typing">|</span>}
              </p>
            </div>
          )}
          
          {/* 消息底部栏 */}
          <div className="mt-2 flex justify-between items-center text-xs text-white/60">
            <span>{formatDate(message.timestamp)}</span>
            
            {/* 语音播放按钮（仅AI消息且非加载状态显示） */}
            {!isUser && !isLoading && settings.voiceEnabled && (
              <button
                onClick={handleSpeak}
                className="p-1 rounded-full hover:bg-dark-700 transition-colors"
                aria-label={isSpeaking ? '停止语音' : '播放语音'}
              >
                {isSpeaking ? <StopCircleIcon className="h-4 w-4" /> : <PlayCircleIcon className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 