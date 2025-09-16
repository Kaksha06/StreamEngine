import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Clock, ThumbsUp, PlaySquare, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    ...(isAuthenticated ? [
      { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
      { icon: Clock, label: 'History', path: '/history' },
      { icon: ThumbsUp, label: 'Liked Videos', path: '/liked' },
      { icon: PlaySquare, label: 'Your Videos', path: '/your-videos' },
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64`}
    >
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {!isAuthenticated && (
          <div className="mt-8 p-4 border-t border-gray-200 dark:border-dark-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Sign in to like videos, comment, and subscribe.
            </p>
            <Link to="/login" className="btn-primary w-full text-center block">
              Sign In
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;