import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">ابدأ رحلتك نحو حياة أفضل</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            منصة متكاملة لتطوير ذاتك وتحقيق أهدافك وتحسين جودة حياتك اليومية
          </p>
          <Link 
            to="/goals" 
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300"
          >
            ابدأ الآن
          </Link>
        </div>
      </section>

      {/* Features Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">ما الذي نقدمه</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/goals" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">الأهداف الشخصية</h3>
              <p className="text-gray-600">حدد أهدافك اليومية والأسبوعية والشهرية مع أدوات لتتبع التقدم</p>
            </Link>
            
            <Link to="/resources" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">مكتبة الموارد</h3>
              <p className="text-gray-600">مقالات ومدونات حول التطوير الذاتي والإنتاجية</p>
            </Link>
            
            <Link to="/tools" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-bold mb-2">أدوات التحميل المجانية</h3>
              <p className="text-gray-600">دفاتر عمل وأدوات نمو شخصي مجانية</p>
            </Link>
            
            <Link to="/community" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">مجتمع الدعم</h3>
              <p className="text-gray-600">انضم إلى مجتمع تفاعلي لمشاركة تجاربك</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">العادات اليومية</h2>
              <p className="text-lg text-gray-700 mb-4">
                أدوات لبناء العادات الإيجابية وكسر العادات السيئة مع تذكيرات يومية وإحصائيات مرئية.
              </p>
              <Link to="/habits" className="text-blue-600 font-bold hover:underline">
                اكتشف أدوات العادات →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">نموذج عادة يومية</h3>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['أ', 'إ', 'ث', 'أر', 'خ', 'ج', 'س'].map((day, index) => (
                  <div key={index} className="p-2 bg-blue-100 rounded text-sm">{day}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">الإلهام اليومي</h2>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <blockquote className="text-xl italic text-gray-700 mb-4">
              "الشيء الوحيد الذي يقف بينك وبين حلمك هو الإرادة لمحاولة تحقيقه"
            </blockquote>
            <cite className="text-gray-600">- مؤلف غير معروف</cite>
          </div>
          <Link to="/inspiration" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
            اقرأ المزيد من المصادر المحفزة
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">نصائح الإنتاجية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-3">تقنية بومودورو</h3>
              <p className="text-gray-600">طريقة فعالة لزيادة التركيز وتحسين الكفاءة</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-3">إدارة الوقت</h3>
              <p className="text-gray-600">أساليب لتنظيم وقتك وتحقيق أهدافك بفعالية</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-3">التحفيز الذاتي</h3>
              <p className="text-gray-600">كيف تبقي نفسك متحفزاً في الأوقات الصعبة</p>
            </div>
          </div>
          <Link to="/productivity" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
            اكتشف كل نصائح الإنتاجية
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;