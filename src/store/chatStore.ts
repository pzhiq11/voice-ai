import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatHistory, AIProvider } from '../types';
import { generateId, createUserMessage, createAssistantMessage } from '../utils/helpers';
import aiService from '../services/aiService';

interface ChatState {
  chatHistories: ChatHistory[];
  currentChatId: string | null;
  isLoading: boolean;
  error: string | null;
  getCurrentChat: () => ChatHistory | null;
  createNewChat: (initialMessage?: string) => string;
  sendMessage: (content: string) => Promise<void>;
  setCurrentChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, title: string) => void;
  clearAllChats: () => void;
  setAIProvider: (provider: AIProvider, apiKey?: string) => void;
  getAIProvider: () => AIProvider;
  abortCurrentRequest: () => void;
}

// 创建聊天状态
const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatHistories: [],
      currentChatId: null,
      isLoading: false,
      error: null,

      // 获取当前聊天历史
      getCurrentChat: () => {
        const { chatHistories, currentChatId } = get();
        if (!currentChatId) return null;
        return chatHistories.find(chat => chat.id === currentChatId) || null;
      },

      // 创建新聊天
      createNewChat: (initialMessage?: string) => {
        const newChatId = generateId();
        const newChat: ChatHistory = {
          id: newChatId,
          title: `新对话 ${new Date().toLocaleString('zh-CN', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
          })}`,
          messages: initialMessage 
            ? [createUserMessage(initialMessage)]
            : [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        set(state => ({
          chatHistories: [newChat, ...state.chatHistories],
          currentChatId: newChatId,
          error: null
        }));

        // 如果有初始消息，自动发送AI请求，但不要再次调用sendMessage
        if (initialMessage) {
          // 直接处理AI响应，而不是递归调用sendMessage
          const sendInitialMessage = async () => {
            const { chatHistories } = get();
            const currentChatIndex = chatHistories.findIndex(chat => chat.id === newChatId);
            
            if (currentChatIndex === -1) return;
            
            // 创建临时AI助手消息（加载中状态）
            const tempAssistantMessage = createAssistantMessage('', true);
            
            // 更新聊天历史添加加载中的消息
            const updatedChatHistories = [...chatHistories];
            updatedChatHistories[currentChatIndex] = {
              ...updatedChatHistories[currentChatIndex],
              messages: [
                ...updatedChatHistories[currentChatIndex].messages,
                tempAssistantMessage
              ],
              updatedAt: Date.now()
            };
            
            set({
              chatHistories: updatedChatHistories,
              isLoading: true,
              error: null
            });
            
            try {
              // 发送消息到AI服务
              const messages = [
                ...updatedChatHistories[currentChatIndex].messages
              ];
              
              const response = await aiService.sendMessage(messages);
              
              // 用实际回复替换临时消息
              const finalMessages = [
                ...updatedChatHistories[currentChatIndex].messages.slice(0, -1),
                createAssistantMessage(response)
              ];
              
              // 更新聊天历史
              const finalChatHistories = [...get().chatHistories];
              finalChatHistories[currentChatIndex] = {
                ...finalChatHistories[currentChatIndex],
                messages: finalMessages,
                title: initialMessage.substring(0, 30) + (initialMessage.length > 30 ? '...' : ''),
                updatedAt: Date.now()
              };
              
              set({
                chatHistories: finalChatHistories,
                isLoading: false
              });
            } catch (error) {
              // 更新错误状态
              const errorMessage = error instanceof Error ? error.message : '发送消息时出错';
              
              // 移除临时消息
              const errorChatHistories = [...get().chatHistories];
              errorChatHistories[currentChatIndex] = {
                ...errorChatHistories[currentChatIndex],
                messages: errorChatHistories[currentChatIndex].messages.slice(0, -1),
                updatedAt: Date.now()
              };
              
              set({
                chatHistories: errorChatHistories,
                isLoading: false,
                error: errorMessage
              });
            }
          };
          
          sendInitialMessage();
        }

        return newChatId;
      },

      // 发送消息
      sendMessage: async (content: string) => {
        const { currentChatId, chatHistories } = get();
        
        // 如果没有当前聊天，创建一个新的
        if (!currentChatId) {
          // 创建新聊天，但不要在createNewChat中自动发送初始消息
          const newChatId = get().createNewChat();
          
          // 手动设置当前聊天ID，然后为这个新聊天发送消息
          set({ currentChatId: newChatId });
          
          // 递归调用自己，此时已有currentChatId
          get().sendMessage(content);
          return;
        }

        // 找到当前聊天
        const currentChatIndex = chatHistories.findIndex(chat => chat.id === currentChatId);
        if (currentChatIndex === -1) {
          set({ error: '找不到当前对话' });
          return;
        }

        // 创建用户消息
        const userMessage = createUserMessage(content);
        
        // 创建临时AI助手消息（加载中状态）
        const tempAssistantMessage = createAssistantMessage('', true);
        
        // 更新聊天历史
        const updatedChatHistories = [...chatHistories];
        updatedChatHistories[currentChatIndex] = {
          ...updatedChatHistories[currentChatIndex],
          messages: [
            ...updatedChatHistories[currentChatIndex].messages,
            userMessage,
            tempAssistantMessage
          ],
          updatedAt: Date.now()
        };

        set({
          chatHistories: updatedChatHistories,
          isLoading: true,
          error: null
        });

        try {
          // 发送消息到AI服务
          const messages = [
            ...updatedChatHistories[currentChatIndex].messages.slice(0, -1)
          ];
          
          const response = await aiService.sendMessage(messages);
          
          // 用实际回复替换临时消息
          const finalMessages = [
            ...updatedChatHistories[currentChatIndex].messages.slice(0, -1),
            createAssistantMessage(response)
          ];
          
          // 更新聊天历史
          const finalChatHistories = [...get().chatHistories];
          finalChatHistories[currentChatIndex] = {
            ...finalChatHistories[currentChatIndex],
            messages: finalMessages,
            title: finalChatHistories[currentChatIndex].messages.length <= 2 
              ? content.substring(0, 30) + (content.length > 30 ? '...' : '')
              : finalChatHistories[currentChatIndex].title,
            updatedAt: Date.now()
          };

          set({
            chatHistories: finalChatHistories,
            isLoading: false
          });
        } catch (error) {
          // 更新错误状态
          const errorMessage = error instanceof Error ? error.message : '发送消息时出错';
          
          // 移除临时消息
          const errorChatHistories = [...get().chatHistories];
          errorChatHistories[currentChatIndex] = {
            ...errorChatHistories[currentChatIndex],
            messages: errorChatHistories[currentChatIndex].messages.slice(0, -1),
            updatedAt: Date.now()
          };
          
          set({
            chatHistories: errorChatHistories,
            isLoading: false,
            error: errorMessage
          });
        }
      },

      // 设置当前聊天
      setCurrentChat: (chatId: string) => {
        set({ currentChatId: chatId, error: null });
      },

      // 删除聊天
      deleteChat: (chatId: string) => {
        const { chatHistories, currentChatId } = get();
        const updatedHistories = chatHistories.filter(chat => chat.id !== chatId);
        
        // 如果删除的是当前聊天，重置当前聊天ID
        const newCurrentChatId = currentChatId === chatId
          ? (updatedHistories.length > 0 ? updatedHistories[0].id : null)
          : currentChatId;
        
        set({
          chatHistories: updatedHistories,
          currentChatId: newCurrentChatId
        });
      },

      // 重命名聊天
      renameChat: (chatId: string, title: string) => {
        const { chatHistories } = get();
        const chatIndex = chatHistories.findIndex(chat => chat.id === chatId);
        
        if (chatIndex !== -1) {
          const updatedHistories = [...chatHistories];
          updatedHistories[chatIndex] = {
            ...updatedHistories[chatIndex],
            title
          };
          
          set({ chatHistories: updatedHistories });
        }
      },

      // 清除所有聊天
      clearAllChats: () => {
        set({
          chatHistories: [],
          currentChatId: null,
          error: null
        });
      },

      // 设置AI提供者
      setAIProvider: (provider: AIProvider, apiKey?: string) => {
        aiService.setProvider(provider);
        if (apiKey) {
          aiService.setApiKey(apiKey);
        }
      },

      // 获取AI提供者
      getAIProvider: () => {
        return aiService.getProvider();
      },

      // 中止当前请求
      abortCurrentRequest: () => {
        aiService.abortRequest();
        set({ isLoading: false });
      }
    }),
    {
      name: 'voice-ai-chat-storage'
    }
  )
);

export default useChatStore; 