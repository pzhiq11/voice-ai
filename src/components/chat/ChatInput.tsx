import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon, XMarkIcon, StopIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useVoiceRecognition();
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter 换行，仅Enter 发送
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // 处理发送消息
  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // 聚焦输入框
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };
  
  // 语音识别切换
  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      // 清除现有的消息
      setMessage('');
    }
  };
  
  // 清除按钮
  const handleClear = () => {
    setMessage('');
    resetTranscript();
    
    // 聚焦输入框
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  // 当transcript更新时，更新消息
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);
  
  // 动态调整textarea高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);
  
  return (
    <div className="bg-dark-800/60 backdrop-blur-sm rounded-xl p-3 border border-dark-700">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "正在聆听..." : "输入消息或按麦克风按钮开始语音输入..."}
          className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 pr-24 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
          disabled={isLoading || isListening}
          rows={1}
        />
        
        <div className="absolute right-2 bottom-2 flex space-x-1">
          {/* 清除按钮 - 仅当有内容时显示 */}
          {message && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-dark-400 hover:text-white"
              aria-label="清除输入"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          )}
          
          {/* 语音识别按钮 - 仅在支持时显示 */}
          {isSupported && (
            <Button
              variant={isListening ? 'primary' : 'ghost'}
              size="sm"
              onClick={toggleVoiceRecognition}
              className={isListening ? 'animate-pulse' : ''}
              aria-label={isListening ? '停止语音输入' : '开始语音输入'}
              disabled={isLoading}
            >
              {isListening ? <StopIcon className="h-5 w-5" /> : <MicrophoneIcon className="h-5 w-5" />}
            </Button>
          )}
          
          {/* 发送按钮 */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            aria-label="发送消息"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* 快捷提示 */}
      <div className="mt-2 text-xs text-dark-400 flex justify-between">
        <span>按 Enter 发送 · Shift+Enter 换行</span>
        {isListening && <span className="text-primary-400 animate-pulse">正在聆听您的声音...</span>}
      </div>
    </div>
  );
};

export default ChatInput; 