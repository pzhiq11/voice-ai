import React, { useRef, useEffect } from 'react';
import { PlusIcon, TrashIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Card from '../ui/Card';
import useChatStore from '../../store/chatStore';
import { formatRelativeTime } from '../../utils/helpers';

const ChatInterface: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    chatHistories,
    currentChatId,
    isLoading,
    error,
    getCurrentChat,
    createNewChat,
    sendMessage,
    setCurrentChat,
    deleteChat,
    abortCurrentRequest
  } = useChatStore();
  
  const currentChat = getCurrentChat();
  
  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 当消息变化时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);
  
  // 处理发送消息
  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };
  
  // 创建新聊天
  const handleNewChat = () => {
    createNewChat();
  };
  
  // 选择聊天
  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId);
  };
  
  // 删除聊天
  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(chatId);
  };
  
  // 中止请求
  const handleAbortRequest = () => {
    abortCurrentRequest();
  };
  
  return (
    <div className="container-custom py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 侧边栏 */}
        <div className="w-full md:w-80 lg:w-96 md:h-[calc(100vh-8rem)] flex flex-col">
          <Card className="h-full flex flex-col">
            {/* 新建聊天按钮 */}
            <div className="mb-4">
              <Button
                fullWidth
                onClick={handleNewChat}
                leftIcon={<PlusIcon className="h-5 w-5" />}
              >
                新对话
              </Button>
            </div>
            
            {/* 聊天历史列表 */}
            <div className="flex-grow overflow-y-auto">
              {chatHistories.length === 0 ? (
                <div className="text-center py-10 text-dark-400">
                  <p>暂无聊天记录</p>
                  <p className="text-sm mt-2">点击"新对话"开始聊天</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatHistories.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentChatId === chat.id
                          ? 'bg-primary-500/10 border border-primary-500/30'
                          : 'hover:bg-dark-700 border border-transparent'
                      }`}
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="truncate flex-1">
                          <h3 className="font-medium truncate">{chat.title}</h3>
                          <p className="text-xs text-dark-400 mt-1">
                            {formatRelativeTime(chat.updatedAt)}
                            {' · '}
                            {chat.messages.length} 条消息
                          </p>
                        </div>
                        <button
                          className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          aria-label="删除对话"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 底部链接 */}
            <div className="mt-4 pt-4 border-t border-dark-700">
              <Link to="/settings">
                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<Cog6ToothIcon className="h-5 w-5" />}
                >
                  设置
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        
        {/* 聊天区域 */}
        <div className="flex-1 md:h-[calc(100vh-8rem)]">
          <Card padding="none" className="h-full flex flex-col">
            {/* 聊天头部 */}
            <div className="p-4 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-lg font-display font-medium">
                {currentChat ? currentChat.title : '开始新对话'}
              </h2>
              {isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAbortRequest}
                >
                  停止生成
                </Button>
              )}
            </div>
            
            {/* 聊天消息区域 */}
            <div className="flex-grow p-4 overflow-y-auto">
              {!currentChat || currentChat.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                    AI
                  </div>
                  <h2 className="text-xl font-display font-medium mb-2">Voice AI 语音助手</h2>
                  <p className="text-dark-400 max-w-md mb-6">
                    使用语音或文字与AI进行对话。点击下方麦克风按钮开始语音输入，或直接输入文字消息。
                  </p>
                  <Button
                    onClick={handleNewChat}
                    leftIcon={<PlusIcon className="h-5 w-5" />}
                  >
                    开始新对话
                  </Button>
                </div>
              ) : (
                <>
                  {currentChat.messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isLast={index === currentChat.messages.length - 1}
                    />
                  ))}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* 聊天输入区域 */}
            <div className="p-4 border-t border-dark-700">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 