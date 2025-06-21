import React from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, UserGroupIcon, CpuChipIcon, MicrophoneIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero区域 */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/10 z-0"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-secondary-500/30 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              语音AI助手
            </h1>
            <p className="text-xl text-white/80 mb-8">
              使用先进的AI技术实现真人般的语音交流体验，支持Google Gemini和OpenAI双重引擎。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/chat">
                <Button
                  size="lg"
                  leftIcon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
                >
                  开始对话
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                >
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
          
          {/* 展示图 */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent z-10 h-20 bottom-0 top-auto"></div>
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video max-h-[600px] w-full overflow-hidden">
                <img
                  src="https://qiniu.zhiji-pzhiq.top/uploads/1750239388646-m0qbq4.png"
                  alt="Voice AI演示"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 特性区域 */}
      <section className="py-20 bg-gradient-to-b from-dark-950 to-dark-900">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">强大功能，智能交互</h2>
            <p className="text-white/70">
              Voice AI集成了最先进的语音识别和AI聊天技术，为您带来流畅自然的交互体验。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 特性卡片1 */}
            <Card variant="glass" className="group hover:scale-[1.02] transition-all duration-300">
              <div className="text-primary-400 mb-4 p-3 bg-primary-500/10 rounded-lg inline-block group-hover:bg-primary-500/20 transition-all">
                <MicrophoneIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-display font-medium mb-2">语音识别</h3>
              <p className="text-white/70">
                实时语音识别技术，准确捕捉您的语音指令，让交流更加自然流畅。
              </p>
            </Card>
            
            {/* 特性卡片2 */}
            <Card variant="glass" className="group hover:scale-[1.02] transition-all duration-300">
              <div className="text-secondary-400 mb-4 p-3 bg-secondary-500/10 rounded-lg inline-block group-hover:bg-secondary-500/20 transition-all">
                <CpuChipIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-display font-medium mb-2">双引擎支持</h3>
              <p className="text-white/70">
                同时支持Google Gemini和OpenAI，根据需求灵活切换AI引擎。
              </p>
            </Card>
            
            {/* 特性卡片3 */}
            <Card variant="glass" className="group hover:scale-[1.02] transition-all duration-300">
              <div className="text-primary-400 mb-4 p-3 bg-primary-500/10 rounded-lg inline-block group-hover:bg-primary-500/20 transition-all">
                <UserGroupIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-display font-medium mb-2">自然对话</h3>
              <p className="text-white/70">
                AI助手能够理解上下文，进行连贯、自然的对话，体验接近真人交流。
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* 快速开始区域 */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-900/50 to-secondary-900/50 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                  立即开始您的AI语音之旅
                </h2>
                <p className="text-white/70 mb-6 max-w-xl">
                  只需点击几下，即可体验语音AI的强大功能。无需复杂设置，简单易用。
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/chat">
                    <Button
                      leftIcon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
                    >
                      开始对话
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button
                      variant="outline"
                      leftIcon={<Cog6ToothIcon className="h-5 w-5" />}
                    >
                      系统设置
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow animate-pulse-slow">
                <MicrophoneIcon className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 