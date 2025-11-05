import React from 'react';
import {
  FiUsers, FiUser, FiUserCheck, FiUserPlus, FiFolder, FiFolderPlus,
  FiCheckCircle, FiXCircle, FiClock, FiAlertTriangle, FiPlusCircle,
  FiCheck, FiTrendingUp, FiActivity, FiDatabase
} from 'react-icons/fi';
import { FaHourglassHalf, FaCheckDouble } from "react-icons/fa";
import {
  HiOutlineExclamationTriangle, HiOutlineDocumentText
} from 'react-icons/hi2';

// Icon mapping helper
const getIcon = (iconName, size = 24) => {
  const iconMap = {
    'user': <FiUser size={size} />,
    'users': <FiUsers size={size} />,
    'user-check': <FiUserCheck size={size} />,
    'user-plus': <FiUserPlus size={size} />,
    'folder': <FiFolder size={size} />,
    'folder-plus': <FiFolderPlus size={size} />,
    'check-circle': <FiCheckCircle size={size} />,
    'x-circle': <FiXCircle size={size} />,
    'clock': <FiClock size={size} />,
    'alert-triangle': <FiAlertTriangle size={size} />,
    'exclamation-triangle': <HiOutlineExclamationTriangle size={size} />,
    'plus-circle': <FiPlusCircle size={size} />,
    'check': <FiCheck size={size} />,
    'check-double': <FaCheckDouble size={size} />,
    'hourglass': <FaHourglassHalf size={size} />,
    'trending-up': <FiTrendingUp size={size} />,
    'activity': <FiActivity size={size} />,
    'database': <FiDatabase size={size} />,
    'document': <HiOutlineDocumentText size={size} />,
  };
  return iconMap[iconName] || <FiActivity size={size} />;
};

export const IssueCard = ({ title, count, icon, variant = 'default', loading = false }) => {
  const variantClasses = {
    default: 'bg-white border-gray-200 text-gray-700 shadow-sm hover:shadow-md',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm hover:shadow-md',
    error: 'bg-red-50 border-red-200 text-red-800 shadow-sm hover:shadow-md',
    success: 'bg-green-50 border-green-200 text-green-800 shadow-sm hover:shadow-md',
  };

  const iconColors = {
    default: 'text-gray-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
    success: 'text-green-500',
  };

  return (
    <div className={`${variantClasses[variant]} border rounded-lg p-6 transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center space-x-4">
        <div className={`${iconColors[variant]} p-3 bg-gray-50 rounded-lg`}>
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
          ) : (
            getIcon(icon, 24)
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80 leading-tight">{title}</p>
          <h4 className="text-2xl font-bold mt-1">
            {loading ? '...' : (count?.toLocaleString() || '0')}
          </h4>
        </div>
      </div>
    </div>
  );
};

export const UserCard = ({ user, loading = false }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="space-y-4">
        {loading ? (
          <>
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <FiUser size={20} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{user?.name || 'Unknown User'}</h4>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex items-center justify-between">
                <span>Projects:</span>
                <span className="font-semibold text-blue-600">{user?.projectCount || 0}</span>
              </p>
              <p className="text-xs text-gray-500">ID: {user?._id?.slice(-8) || 'N/A'}</p>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                Top Contributor
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ProjectCard = ({ title, count, icon, variant = 'default', loading = false }) => {
  const variantClasses = {
    default: 'bg-white border-gray-200 text-gray-700 shadow-sm hover:shadow-md',
    primary: 'bg-blue-50 border-blue-200 text-blue-800 shadow-sm hover:shadow-md',
    success: 'bg-green-50 border-green-200 text-green-800 shadow-sm hover:shadow-md',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm hover:shadow-md',
    error: 'bg-red-50 border-red-200 text-red-800 shadow-sm hover:shadow-md',
  };

  const iconColors = {
    default: 'text-gray-500',
    primary: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
  };

  return (
    <div className={`${variantClasses[variant]} border rounded-lg p-6 transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center space-x-4">
        <div className={`${iconColors[variant]} p-3 bg-white rounded-lg shadow-sm`}>
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
          ) : (
            getIcon(icon, 24)
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80 leading-tight">{title}</p>
          <h4 className="text-2xl font-bold mt-1">
            {loading ? '...' : (count?.toLocaleString() || '0')}
          </h4>
        </div>
      </div>
    </div>
  );
};

export const StatsCard = ({ title, count, icon, variant = 'default', loading = false }) => {
  const variantClasses = {
    default: 'bg-white border-gray-200 text-gray-800 shadow-sm hover:shadow-md',
    primary: 'bg-blue-600 border-blue-600 text-white shadow-sm hover:shadow-lg',
    success: 'bg-green-600 border-green-600 text-white shadow-sm hover:shadow-lg',
    warning: 'bg-amber-600 border-amber-600 text-white shadow-sm hover:shadow-lg',
    error: 'bg-red-600 border-red-600 text-white shadow-sm hover:shadow-lg',
    secondary: 'bg-gray-700 border-gray-700 text-white shadow-sm hover:shadow-lg',
  };

  const iconBgClasses = {
    default: 'bg-gray-100',
    primary: 'bg-blue-500 bg-opacity-20',
    success: 'bg-green-500 bg-opacity-20',
    warning: 'bg-amber-500 bg-opacity-20',
    error: 'bg-red-500 bg-opacity-20',
    secondary: 'bg-gray-600 bg-opacity-20',
  };

  const iconColors = {
    default: 'text-gray-600',
    primary: 'text-blue-100',
    success: 'text-green-100',
    warning: 'text-amber-100',
    error: 'text-red-100',
    secondary: 'text-gray-100',
  };

  return (
    <div className={`${variantClasses[variant]} border rounded-lg p-6 transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center space-x-4">
        <div className={`${iconBgClasses[variant]} ${iconColors[variant]} p-3 rounded-lg`}>
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
          ) : (
            getIcon(icon, 24)
          )}
        </div>
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <h4 className="text-3xl font-bold mt-1">
            {loading ? '...' : (count?.toLocaleString() || '0')}
          </h4>
        </div>
      </div>
    </div>
  );
};

export const CardSection = ({ 
  title, 
  children, 
  className = '', 
  gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
}) => {
  return (
    <section className={`mb-8 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
          <FiActivity size={20} className="text-gray-600" />
          <span>{title}</span>
        </h3>
        <div className={`grid ${gridCols} gap-6`}>
          {children}
        </div>
      </div>
    </section>
  );
};
