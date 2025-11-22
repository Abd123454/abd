import React from 'react';
import { Link } from 'react-router-dom';

const Resources = () => {
  const resources = [
    {
      id: 1,
      title: "التطوير الذاتي",
      description: "مقالات موثقة حول النمو الشخصي والمهارات الحياتية",
      icon: "📚",
      category: "development"
    },
    {
      id: 2,
      title: "الإنتاجية",
      description: "نصائح وأساليب لتحسين كفاءة العمل والحياة",
      icon: "⚡",
      category: "productivity"
    },
    {
      id: 3,
      title: "التحفيز",
      description: "قصص وتجارب تحفزك على الاستمرار في التقدم",
      icon: "🔥",
      category: "motivation"
    },
    {
      id: 4,
      title: "إدارة الوقت",
      description: "تقنيات فعالة لتنظيم وقتك وتحقيق أهدافك",
      icon: "⏰",
      category: "time-management"
    },
    {
      id: 5,
      title: "العادات الإيجابية",
      description: "كيف تبني عادات تحسن حياتك اليومية",
      icon: "🔄",
      category: "habits"
    },
    {
      id: 6,
      title: "التركيز والانتباه",
      description: "أساليب لزيادة قدرتك على التركيز",
      icon: "🎯",
      category: "focus"
    }
  ];

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">مكتبة الموارد</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          مقالات ومدونات حول التطوير الذاتي والإنتاجية من أبرز المصادر
        </p>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">عن هذه المكتبة</h2>
          <p className="text-gray-700 mb-4">
            مكتبة الموارد هذه تحتوي على مقالات ومدونات موثقة تغطي مختلف جوانب التطوير الذاتي والإنتاجية،
            مستوحاة من المواقع الرائدة في هذا المجال مثل Lifehacker و Mark Manson و 99U.
          </p>
          <p className="text-gray-700">
            نسعى لتقديم محتوى قيم يساعد المستخدمين على تطوير شخصياتهم، السمات الإيجابية، 
            والمواقف الحسنة التي تحفز سلوكهم ليعكسوا الحكمة والتعلم المستمر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {resources.map(resource => (
            <div key={resource.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">{resource.icon}</div>
              <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <Link 
                to="#" 
                className="text-blue-600 font-bold hover:underline inline-block"
              >
                اقرأ المزيد →
              </Link>
            </div>
          ))}
        </div>

        {/* Featured Articles Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">مقالات مميزة</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">كيف تحدد أهدافاً واقعية وتحققها</h3>
              <p className="text-gray-600 mb-4">
                تعلم مبادئ تحديد الأهداف بحسب طريقة SMART وتطبيقها في حياتك اليومية 
                لتحقيق نتائج ملموسة ومستدامة.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">نشر في: 15 نوفمبر 2025</span>
                <Link to="#" className="text-blue-600 font-bold hover:underline">اقرأ المقال</Link>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">بناء عادات إيجابية بشكل دائم</h3>
              <p className="text-gray-600 mb-4">
                اكتشف العلوم الكامنة خلف تكوين العادات وكيفية تطبيقها لبناء روتين يومي 
                يعزز من إنتاجيتك وصحتك النفسية.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">نشر في: 12 نوفمبر 2025</span>
                <Link to="#" className="text-blue-600 font-bold hover:underline">اقرأ المقال</Link>
              </div>
            </div>
          </div>
        </div>

        {/* External Resources Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">مصادر خارجية موصى بها</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-bold mb-2">Lifehacker</h3>
              <p className="text-sm text-gray-600 mb-3">نصائح عملية لتحسين الحياة اليومية</p>
              <a href="https://lifehacker.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                زيارة الموقع →
              </a>
            </div>
            
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-bold mb-2">Mark Manson</h3>
              <p className="text-sm text-gray-600 mb-3">أفكار عميقة حول الحياة والنمو الشخصي</p>
              <a href="https://markmanson.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                زيارة الموقع →
              </a>
            </div>
            
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-bold mb-2">99U</h3>
              <p className="text-sm text-gray-600 mb-3">إلهام وموارد للأشخاص الإبداعيين</p>
              <a href="https://99u.adobe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                زيارة الموقع →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;