import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowTopRightOnSquareIcon, GlobeAltIcon, CpuChipIcon, MicrophoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const AboutPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display font-bold mb-8">关于 Voice AI</h1>
        
        {/* 介绍 */}
        <Card className="mb-8">
          <h2 className="text-xl font-display font-medium mb-4">项目介绍</h2>
          <p className="mb-4 text-white/80">
            Voice AI 是一个先进的语音人工智能助手，专为提供自然流畅的对话体验而设计。
            它结合了强大的语音识别和语音合成技术，让您可以使用语音与AI进行交互，就像与真人对话一样。
          </p>
          <p className="text-white/80">
            本项目使用现代前端技术栈构建，包括React、TypeScript和Tailwind CSS，
            支持OpenAI和Google Gemini两种AI引擎，让您能够根据需求灵活选择。
          </p>
        </Card>
        
        {/* 主要技术 */}
        <Card className="mb-8">
          <h2 className="text-xl font-display font-medium mb-4">主要技术</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="text-primary-400 p-2 bg-primary-500/10 rounded-lg">
                <CpuChipIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">AI引擎</h3>
                <p className="text-sm text-white/70">
                  OpenAI GPT模型和Google Gemini模型，支持智能对话和上下文理解。
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="text-secondary-400 p-2 bg-secondary-500/10 rounded-lg">
                <MicrophoneIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">语音技术</h3>
                <p className="text-sm text-white/70">
                  Web Speech API实现语音识别和语音合成，提供自然的语音交互体验。
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="text-primary-400 p-2 bg-primary-500/10 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">消息管理</h3>
                <p className="text-sm text-white/70">
                  使用Zustand进行状态管理，实现高效的消息存储和历史记录功能。
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="text-secondary-400 p-2 bg-secondary-500/10 rounded-lg">
                <GlobeAltIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">开源技术</h3>
                <p className="text-sm text-white/70">
                  基于React、TypeScript和Tailwind CSS构建，采用现代前端开发最佳实践。
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* 使用指南 */}
        <Card className="mb-8">
          <h2 className="text-xl font-display font-medium mb-4">使用指南</h2>
          <ol className="list-decimal list-inside space-y-2 text-white/80 pl-1">
            <li>
              <span className="font-medium">开始对话</span>：
              点击"开始对话"按钮，进入聊天界面。
            </li>
            <li>
              <span className="font-medium">语音输入</span>：
              点击麦克风按钮，开始语音输入。说完后，内容会自动转换为文字。
            </li>
            <li>
              <span className="font-medium">文字输入</span>：
              您也可以直接在输入框中键入文字，按Enter键发送。
            </li>
            <li>
              <span className="font-medium">语音回复</span>：
              AI的回复会自动朗读（如果启用了语音功能）。您可以点击回复旁的播放按钮重新聆听。
            </li>
            <li>
              <span className="font-medium">配置设置</span>：
              在设置页面中，您可以配置AI提供商、API密钥和语音选项。
            </li>
          </ol>
        </Card>
        
        {/* 注意事项 */}
        <Card className="mb-8">
          <h2 className="text-xl font-display font-medium mb-4">注意事项</h2>
          <ul className="list-disc list-inside space-y-2 text-white/80 pl-1">
            <li>
              Voice AI需要浏览器支持语音识别和语音合成API。推荐使用Chrome、Edge或Safari最新版本。
            </li>
            <li>
              使用语音功能时，请确保您的设备有可用的麦克风，并已授予浏览器使用麦克风的权限。
            </li>
            <li>
              为了使用AI功能，您需要提供有效的API密钥。API密钥仅存储在本地，不会发送到任何第三方服务器。
            </li>
            <li>
              所有的对话数据都存储在浏览器本地，清除浏览器数据可能会导致历史对话丢失。
            </li>
          </ul>
        </Card>
        
        {/* 开始使用 */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-display font-medium mb-4">准备好开始了吗？</h2>
          <p className="mb-6 text-white/80">
            立即尝试Voice AI，体验未来的交互方式。
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/chat">
              <Button
                size="lg"
                leftIcon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
              >
                开始对话
              </Button>
            </Link>
            <a href="https://github.com/google-gemini/live-api-web-console" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<ArrowTopRightOnSquareIcon className="h-5 w-5" />}
              >
                参考资料
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 