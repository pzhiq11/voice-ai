import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * 格式化日期
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 格式化时间（相对时间）
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffSeconds < 60) {
    return '刚刚';
  }
  
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}天前`;
  }
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN');
};

/**
 * 创建新的用户消息
 */
export const createUserMessage = (content: string): ChatMessage => {
  return {
    id: generateId(),
    role: 'user',
    content,
    timestamp: Date.now(),
    isLoading: false
  };
};

/**
 * 创建新的AI助手消息
 */
export const createAssistantMessage = (content: string, isLoading = false): ChatMessage => {
  return {
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: Date.now(),
    isLoading
  };
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 将文本转换为安全的URL参数
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * 检测网络连接
 */
export const checkNetworkConnection = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.error('网络连接检测失败:', error);
    return false;
  }
};

/**
 * 测试Google API连接
 */
export const testGoogleAPIConnection = async (): Promise<boolean> => {
  return await checkNetworkConnection('https://generativelanguage.googleapis.com/');
};

/**
 * 测试OpenAI API连接
 */
export const testOpenAIConnection = async (): Promise<boolean> => {
  return await checkNetworkConnection('https://api.openai.com/');
}; 