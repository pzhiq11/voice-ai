import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, AIConfig, AIProvider } from '../types';

interface SettingsState {
  // 应用设置
  settings: AppSettings;
  // AI配置
  aiConfig: AIConfig;
  // 更新设置
  updateSettings: (settings: Partial<AppSettings>) => void;
  // 更新AI配置
  updateAIConfig: (config: Partial<AIConfig>) => void;
  // 重置所有设置
  resetSettings: () => void;
}

// 默认设置
const defaultSettings: AppSettings = {
  autoPlayVoice: true,
  voiceEnabled: true,
  voiceVolume: 1.0,
  voiceRate: 1.0,
  voicePitch: 1.0,
  preferredVoice: null
};

// 默认AI配置
const defaultAIConfig: AIConfig = {
  provider: (process.env.REACT_APP_DEFAULT_AI_PROVIDER as AIProvider) || 'gemini',
  apiKey: undefined,
  model: 'default',
  temperature: 0.7,
  maxTokens: 1000
};

// 创建设置状态
const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      aiConfig: defaultAIConfig,

      // 更新设置
      updateSettings: (newSettings: Partial<AppSettings>) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...newSettings
          }
        }));
      },

      // 更新AI配置
      updateAIConfig: (newConfig: Partial<AIConfig>) => {
        set(state => ({
          aiConfig: {
            ...state.aiConfig,
            ...newConfig
          }
        }));
      },

      // 重置所有设置
      resetSettings: () => {
        set({
          settings: defaultSettings,
          aiConfig: defaultAIConfig
        });
      }
    }),
    {
      name: 'voice-ai-settings-storage'
    }
  )
);

export default useSettingsStore; 