import React, { useState, useEffect } from 'react';
import { DocumentCheckIcon, ArrowPathIcon, SpeakerWaveIcon, SpeakerXMarkIcon, WifiIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useSettingsStore from '../store/settingsStore';
import useChatStore from '../store/chatStore';
import useVoiceSynthesis from '../hooks/useVoiceSynthesis';
import { testGoogleAPIConnection, testOpenAIConnection } from '../utils/helpers';

const SettingsPage: React.FC = () => {
  const { settings, aiConfig, updateSettings, updateAIConfig, resetSettings } = useSettingsStore();
  const { setAIProvider } = useChatStore();
  
  const [openaiApiKey, setOpenaiApiKey] = useState(aiConfig.provider === 'openai' ? aiConfig.apiKey || '' : '');
  const [geminiApiKey, setGeminiApiKey] = useState(aiConfig.provider === 'gemini' ? aiConfig.apiKey || '' : '');
  const [provider, setProvider] = useState(aiConfig.provider);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{google?: boolean; openai?: boolean}>({});
  
  const { voices, currentVoice, changeVoice, speak, isSupported } = useVoiceSynthesis({ settings });
  
  // 当切换提供商时更新状态
  useEffect(() => {
    if (provider === 'openai' && openaiApiKey === '' && aiConfig.provider === 'openai' && aiConfig.apiKey) {
      setOpenaiApiKey(aiConfig.apiKey);
    } else if (provider === 'gemini' && geminiApiKey === '' && aiConfig.provider === 'gemini' && aiConfig.apiKey) {
      setGeminiApiKey(aiConfig.apiKey);
    }
  }, [provider, aiConfig]);
  
  // 测试语音
  const testVoice = () => {
    speak('您好，这是一条测试语音消息，用于测试语音合成效果。');
  };
  
  // 测试API连接
  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus({});
    
    try {
      const googleConnected = await testGoogleAPIConnection();
      setConnectionStatus(prev => ({ ...prev, google: googleConnected }));
      
      const openaiConnected = await testOpenAIConnection();
      setConnectionStatus(prev => ({ ...prev, openai: openaiConnected }));
    } catch (error) {
      console.error('连接测试失败:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  // 保存设置
  const saveSettings = () => {
    // 更新AI配置
    const newAiConfig = {
      ...aiConfig,
      provider,
      apiKey: provider === 'openai' ? openaiApiKey : geminiApiKey
    };
    
    updateAIConfig(newAiConfig);
    setAIProvider(provider, newAiConfig.apiKey);
    
    // 显示保存成功提示
    alert('设置已保存');
  };
  
  // 重置设置
  const handleReset = () => {
    if (window.confirm('确定要重置所有设置吗？')) {
      resetSettings();
      setOpenaiApiKey('');
      setGeminiApiKey('');
      setProvider('gemini');
    }
  };
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-display font-bold mb-6">设置</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI设置 */}
        <Card>
          <h2 className="text-xl font-display font-medium mb-4">AI提供商设置</h2>
          
          <div className="space-y-4">
            {/* AI提供商选择 */}
            <div>
              <label className="block mb-2 text-sm font-medium">AI提供商</label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    provider === 'gemini'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-700 hover:border-primary-400'
                  }`}
                  onClick={() => setProvider('gemini')}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔮</span>
                    <div>
                      <h3 className="font-medium">Google Gemini</h3>
                      <p className="text-xs text-dark-400">Google的生成式AI</p>
                    </div>
                  </div>
                </div>
                
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    provider === 'openai'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-700 hover:border-primary-400'
                  }`}
                  onClick={() => setProvider('openai')}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🤖</span>
                    <div>
                      <h3 className="font-medium">OpenAI</h3>
                      <p className="text-xs text-dark-400">GPT模型提供商</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* API密钥设置 */}
            {provider === 'openai' ? (
              <Input
                label="OpenAI API密钥"
                type="password"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-..."
                fullWidth
              />
            ) : (
              <Input
                label="Google Gemini API密钥"
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AI..."
                fullWidth
              />
            )}
            
            <p className="text-xs text-dark-400">
              您的API密钥仅存储在本地浏览器中，不会发送到任何服务器。
            </p>
            
            {/* 连接测试 */}
            <div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<WifiIcon className="h-5 w-5" />}
                onClick={testConnection}
                disabled={isTestingConnection}
                className="mb-2"
              >
                {isTestingConnection ? '测试中...' : '测试API连接'}
              </Button>
              
              {connectionStatus.google !== undefined && (
                <div className={`text-sm p-2 rounded ${connectionStatus.google ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  Google API: {connectionStatus.google ? '连接正常' : '连接失败'}
                </div>
              )}
              
              {connectionStatus.openai !== undefined && (
                <div className={`text-sm p-2 rounded mt-1 ${connectionStatus.openai ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  OpenAI API: {connectionStatus.openai ? '连接正常' : '连接失败'}
                </div>
              )}
              
              {(connectionStatus.google === false || connectionStatus.openai === false) && (
                <div className="text-yellow-500 text-xs mt-1 p-2 bg-yellow-500/10 rounded">
                  <p className="font-medium">连接失败可能的原因:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>网络连接问题或防火墙限制</li>
                    <li>需要使用VPN访问（特别是Google服务）</li>
                    <li>API密钥格式错误</li>
                    <li>API服务临时不可用</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* 语音设置 */}
        <Card>
          <h2 className="text-xl font-display font-medium mb-4">语音设置</h2>
          
          <div className="space-y-4">
            {/* 语音开关 */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">语音功能</label>
                <p className="text-xs text-dark-400">启用或禁用AI回复的语音朗读</p>
              </div>
              <div>
                <Button
                  variant={settings.voiceEnabled ? 'primary' : 'outline'}
                  size="sm"
                  leftIcon={settings.voiceEnabled ? <SpeakerWaveIcon className="h-5 w-5" /> : <SpeakerXMarkIcon className="h-5 w-5" />}
                  onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
                >
                  {settings.voiceEnabled ? '已启用' : '已禁用'}
                </Button>
              </div>
            </div>
            
            {/* 自动播放 */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoPlayVoice"
                checked={settings.autoPlayVoice}
                onChange={(e) => updateSettings({ autoPlayVoice: e.target.checked })}
                className="w-4 h-4 rounded border-dark-600 text-primary-600 focus:ring-primary-500 bg-dark-800"
              />
              <label htmlFor="autoPlayVoice" className="text-sm">
                自动朗读AI回复
              </label>
            </div>
            
            {isSupported && settings.voiceEnabled && (
              <>
                {/* 语音选择 */}
                <div>
                  <label className="block mb-2 text-sm font-medium">语音选择</label>
                  <select
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={currentVoice?.name || ''}
                    onChange={(e) => {
                      const selectedVoice = voices.find(v => v.name === e.target.value);
                      if (selectedVoice) {
                        changeVoice(selectedVoice);
                        updateSettings({ preferredVoice: selectedVoice.name });
                      }
                    }}
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 语音速率 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">语音速率</label>
                    <span className="text-sm text-dark-400">{settings.voiceRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.voiceRate}
                    onChange={(e) => updateSettings({ voiceRate: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* 语音音量 */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">语音音量</label>
                    <span className="text-sm text-dark-400">{Math.round(settings.voiceVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.voiceVolume}
                    onChange={(e) => updateSettings({ voiceVolume: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* 测试语音按钮 */}
                <Button
                  variant="outline"
                  leftIcon={<SpeakerWaveIcon className="h-5 w-5" />}
                  onClick={testVoice}
                  disabled={!settings.voiceEnabled}
                >
                  测试语音
                </Button>
              </>
            )}
            
            {!isSupported && (
              <p className="text-yellow-500 text-sm">
                您的浏览器不支持语音合成功能。请使用Chrome、Edge或Safari等现代浏览器。
              </p>
            )}
          </div>
        </Card>
      </div>
      
      {/* 操作按钮 */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          onClick={saveSettings}
          leftIcon={<DocumentCheckIcon className="h-5 w-5" />}
        >
          保存设置
        </Button>
        
        <Button
          variant="outline"
          onClick={handleReset}
          leftIcon={<ArrowPathIcon className="h-5 w-5" />}
        >
          重置设置
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage; 