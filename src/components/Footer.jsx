import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">تحسن</h3>
            <p className="text-gray-300">
              منصة متكاملة لتطوير الذات وتحقيق الأهداف وتحسين جودة الحياة اليومية.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">الأقسام</h4>
            <ul className="space-y-2">
              <li><Link to="/goals" className="text-gray-300 hover:text-white">الأهداف الشخصية</Link></li>
              <li><Link to="/resources" className="text-gray-300 hover:text-white">مكتبة الموارد</Link></li>
              <li><Link to="/tools" className="text-gray-300 hover:text-white">أدوات التحميل</Link></li>
              <li><Link to="/community" className="text-gray-300 hover:text-white">مجتمع الدعم</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">المزيد</h4>
            <ul className="space-y-2">
              <li><Link to="/habits" className="text-gray-300 hover:text-white">العادات اليومية</Link></li>
              <li><Link to="/inspiration" className="text-gray-300 hover:text-white">الإلهام اليومي</Link></li>
              <li><Link to="/productivity" className="text-gray-300 hover:text-white">نصائح الإنتاجية</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">روابط مفيدة</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">من نحن</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">اتصل بنا</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">سياسة الخصوصية</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">الشروط والأحكام</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 تحسن - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;