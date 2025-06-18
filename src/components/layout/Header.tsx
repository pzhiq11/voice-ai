import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Bars3Icon, XMarkIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, HomeIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // 导航链接
  const navLinks = [
    { name: '首页', path: '/', icon: <HomeIcon className="h-5 w-5" /> },
    { name: '语音聊天', path: '/chat', icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> },
    { name: '关于', path: '/about', icon: <InformationCircleIcon className="h-5 w-5" /> },
  ];
  
  // 切换菜单状态
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // 关闭菜单
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-dark-800">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl">V</div>
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">Voice AI</span>
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-white/70 hover:text-white hover:bg-dark-800'
                )}
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* 设置按钮 */}
          <div className="hidden md:flex items-center">
            <Link to="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                leftIcon={<Cog6ToothIcon className="h-5 w-5" />}
              >
                设置
              </Button>
            </Link>
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-900 border-t border-dark-800 animate-fade-in">
          <div className="container-custom py-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'px-4 py-3 rounded-lg flex items-center space-x-3 font-medium transition-colors',
                    location.pathname === link.path
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-white/70 hover:text-white hover:bg-dark-800'
                  )}
                  onClick={closeMenu}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
              <Link
                to="/settings"
                className="px-4 py-3 rounded-lg flex items-center space-x-3 font-medium transition-colors text-white/70 hover:text-white hover:bg-dark-800"
                onClick={closeMenu}
              >
                <span className="text-lg"><Cog6ToothIcon className="h-5 w-5" /></span>
                <span>设置</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 