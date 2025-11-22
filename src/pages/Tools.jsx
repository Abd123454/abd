import React from 'react';
import { Link } from 'react-router-dom';

const Tools = () => {
  const tools = [
    {
      id: 1,
      title: "دفتر متابعة الأهداف",
      description: "قالب PDF لتحديد وتتبع أهدافك بفعالية",
      icon: "📝",
      category: "goals"
    },
    {
      id: 2,
      title: "مخطط بناء العادات",
      description: "أداة تفاعلية لبناء عادات إيجابية ومحاربة السلبية",
      icon: "🔄",
      category: "habits"
    },
    {
      id: 3,
      title: "سجل التأمل اليومي",
      description: "سجل لتدوين تأملاتك اليومية وتحليل الذات",
      icon: "🧘",
      category: "mindfulness"
    },
    {
      id: 4,
      title: "مخطط إدارة الوقت",
      description: "قالب لتنظيم وقتك وتحديد الأولويات",
      icon: "⏰",
      category: "time-management"
    },
    {
      id: 5,
      title: "مجلد التحفيز الشخصي",
      description: "مجموعة من التمارين لتحفيز الذات وتعزيز الثقة",
      icon: "🔥",
      category: "motivation"
    },
    {
      id: 6,
      title: "دفتر التقدم الأسبوعي",
      description: "قالب لمتابعة تقدمك الأسبوعي وتحليل النتائج",
      icon: "📊",
      category: "tracking"
    }
  ];

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">أدوات التحميل المجانية</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          دفاتر عمل رقمية وأدوات نمو شخصي مجانية لمساعدتك في رحلتك التطويرية
        </p>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">عن أدواتنا المجانية</h2>
          <p className="text-gray-700 mb-4">
            نحن نؤمن بأن التطور الشخصي يجب أن يكون في متناول الجميع، لذلك نقدم مجموعة 
            من الأدوات الرقمية المجانية التي ستساعدك في رحلتك نحو حياة أفضل.
          </p>
          <p className="text-gray-700">
            جميع الأدوات مصممة بناءً على أبحاث وأساليب مثبتة علمياً لضمان فعاليتها في 
            تحسين جودة حياتك ومساعدتك على تحقيق أهدافك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tools.map(tool => (
            <div key={tool.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
              <p className="text-gray-600 mb-6">{tool.description}</p>
              <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                تحميل الآن
              </button>
            </div>
          ))}
        </div>

        {/* Featured Tools Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">الأدوات المميزة</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">دفتر متابعة الأهداف</h3>
              <p className="mb-6 opacity-90">
                قالب PDF متطور يساعدك على تحديد أهداف واضحة وقابلة للقياس، 
                وتتبع تقدمك بشكل يومي وأسبوعي وشهري.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center"><span className="ml-2">✓</span> تحديد أهداف بحسب طريقة SMART</li>
                <li className="flex items-center"><span className="ml-2">✓</span> متابعة التقدم اليومية</li>
                <li className="flex items-center"><span className="ml-2">✓</span> تحليل النتائج الشهرية</li>
              </ul>
              <button className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition duration-300">
                تحميل دفتر الأهداف
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">مخطط بناء العادات</h3>
              <p className="mb-6 opacity-90">
                أداة تفاعلية مصممة خصيصاً لمساعدتك على بناء عادات إيجابية 
                والتخلص من العادات السلبية بفعالية.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center"><span className="ml-2">✓</span> تتبع العادات اليومية</li>
                <li className="flex items-center"><span className="ml-2">✓</span> تذكيرات وتقييمات دورية</li>
                <li className="flex items-center"><span className="ml-2">✓</span> تحليل الأنماط السلوكية</li>
              </ul>
              <button className="w-full bg-white text-green-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition duration-300">
                تحميل مخطط العادات
              </button>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">كيفية الاستفادة من الأدوات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-3xl mb-4">1</div>
              <h3 className="font-bold mb-2">التنزيل</h3>
              <p className="text-gray-600">حمل الأداة التي تناسب هدفك الحالي من القائمة أعلاه</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-3xl mb-4">2</div>
              <h3 className="font-bold mb-2">الملء</h3>
              <p className="text-gray-600">املأ الأداة بانتظام وفقاً للإرشادات المقدمة</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-3xl mb-4">3</div>
              <h3 className="font-bold mb-2">المتابعة</h3>
              <p className="text-gray-600">راقب تقدمك وحلل النتائج لتحسين أدائك</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-lg mb-3">نصيحة من فريق العمل</h3>
            <p className="text-gray-700">
              لضمان أفضل النتائج، ننصحك باستخدام أداة واحدة في كل مرة والالتزام بها 
              لمدة 21 يوماً على الأقل. الجودة أهم من الكمية في رحلة التطوير الذاتي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;