import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RiDashboardLine, RiCalendarLine, RiListUnordered, RiPriceTag3Line } from 'react-icons/ri';
import { useLogoutMutation } from '../../services/auth.service';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutFromServer, { isLoading }] = useLogoutMutation();
  

  useEffect(() => {
    if (!isAuthenticated) {
      // Save the attempted URL
      const returnUrl = location.pathname;
      navigate('/auth', { state: { returnUrl } });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  const handleLogout = async() => {
    try {
      await logoutFromServer().unwrap();
      logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ 
    to, 
    icon, 
    children 
  }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(to)
        ? 'bg-primary-50 text-primary-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      <span className="text-xl mr-3">{icon}</span>
      {children}
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="h-full flex flex-col">
          {/* App Title */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Event Scheduler</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your events</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <NavLink to="/" icon={<RiDashboardLine />}>Dashboard</NavLink>
            <NavLink to="/calendar" icon={<RiCalendarLine />}>Calendar</NavLink>
            <NavLink to="/list" icon={<RiListUnordered />}>List View</NavLink>
            <NavLink to="/categories" icon={<RiPriceTag3Line />}>Categories</NavLink>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
};
