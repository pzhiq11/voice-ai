import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container-custom py-20 text-center">
      <div className="max-w-lg mx-auto">
        <div className="text-6xl font-display font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">页面未找到</h1>
        <p className="text-white/70 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button
              leftIcon={<HomeIcon className="h-5 w-5" />}
            >
              返回首页
            </Button>
          </Link>
          <Link to="/chat">
            <Button
              variant="outline"
              leftIcon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
            >
              开始对话
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 