// AI提供者类型
export type AIProvider = 'openai' | 'gemini';

// 聊天消息类型
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  isLoading?: boolean;
}

// 聊天历史类型
export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// AI配置类型
export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// 用户配置类型
export interface UserConfig {
  theme: 'light' | 'dark';
  aiConfig: AIConfig;
}

// 语音识别状态
export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

// 语音合成状态
export interface VoiceSynthesisState {
  isSpeaking: boolean;
  error: string | null;
}

// 应用设置
export interface AppSettings {
  autoPlayVoice: boolean;
  voiceEnabled: boolean;
  voiceVolume: number;
  voiceRate: number;
  voicePitch: number;
  preferredVoice: string | null;
} 