import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'الرئيسية', path: '/', icon: HomeIcon },
  { name: 'المكتبة', path: '/library', icon: BookOpenIcon },
  { name: 'إدارة المهام', path: '/kanban', icon: ClipboardDocumentListIcon },
  { name: 'مؤقت البومودورو', path: '/pomodoro', icon: ClockIcon },
  { name: 'خطة المذاكرة', path: '/study-plan', icon: CalendarDaysIcon },
  { name: 'وضع الطوارئ', path: '/emergency', icon: ExclamationTriangleIcon },
  { name: 'حول المنصة', path: '/about', icon: InformationCircleIcon },
  { name: 'سياسة الخصوصية', path: '/privacy', icon: ShieldCheckIcon },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-gray-100 hover:bg-gray-700 transition-colors"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T+</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Tawjihi+</h1>
              <p className="text-sm text-gray-400">منصة التوجيهي التعليمية</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-br from-primary-600 to-success-600 rounded-lg">
            <h3 className="font-semibold text-white mb-2">💡 نصيحة اليوم</h3>
            <p className="text-sm text-gray-100">
              استخدم تقنية البومودورو لزيادة التركيز - 25 دقيقة دراسة ثم 5 دقائق راحة
            </p>
          </div>
        </div>
      </div>
    </>
  );
}