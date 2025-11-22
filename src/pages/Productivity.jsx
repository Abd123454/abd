import React from 'react';
import { Link } from 'react-router-dom';

const Productivity = () => {
  const productivityTips = [
    {
      id: 1,
      title: "تقنية بومودورو",
      description: "طريقة فعالة لزيادة التركيز وتحسين الكفاءة",
      details: "تقسيم العمل إلى فترات 25 دقيقة من التركيز الكامل متبوعة بفترات راحة قصيرة. هذه الطريقة تساعد على الحفاظ على التركيز وتجنب الإرهاق الذهني.",
      icon: "⏱️",
      category: "التركيز"
    },
    {
      id: 2,
      title: "إدارة الوقت",
      description: "أساليب لتنظيم وقتك وتحقيق أهدافك بفعالية",
      details: "استخدم مصفوفة أيزنهاور لتحديد الأولويات، وجدولة مهامك في أوقات الذروة الذهنية، وحدد أوقاتاً محددة للتحقق من البريد الإلكتروني والاجتماعات.",
      icon: "📅",
      category: "التنظيم"
    },
    {
      id: 3,
      title: "التحفيز الذاتي",
      description: "كيف تبقي نفسك متحفزاً في الأوقات الصعبة",
      details: "حدد أهدافاً واضحة وقابلة للقياس، واحتفل بالإنجازات الصغيرة، و surround نفسك بأشخاص إيجابيين، وراقب تقدمك بانتظام.",
      icon: "🔥",
      category: "التحفيز"
    },
    {
      id: 4,
      title: "العمل دون مقاطعة",
      description: "كيفية إنشاء بيئة عمل خالية من المشتتات",
      details: "خصص مكاناً محدداً للعمل، أغلق الإشعارات، استخدم أدوات تصفية المواقع، وحدد أوقاتاً محددة للرد على الرسائل.",
      icon: "🔇",
      category: "التركيز"
    },
    {
      id: 5,
      title: "التخطيط الاستراتيجي",
      description: "كيفية وضع خطة عمل فعالة",
      details: "استخدم قاعدة SMART لتحديد الأهداف، وقسم المهام الكبيرة إلى خطوات صغيرة، وحدد مواعيد نهائية واقعية، وراقب التقدم بانتظام.",
      icon: "📋",
      category: "التنظيم"
    },
    {
      id: 6,
      title: "التحسين المستمر",
      description: "أساليب لتحسين الأداء اليومي",
      details: "مارس التأمل الذاتي يومياً، وحلل ما يعمل وما لا يعمل، واطلب الملاحظات، وكن منفتحاً على التعلم والتطوير المستمر.",
      icon: "🔄",
      category: "التحفيز"
    }
  ];

  const productivityTools = [
    {
      id: 1,
      name: "مخطط المهام اليومية",
      description: "قالب لتنظيم مهامك اليومية وتحديد الأولويات"
    },
    {
      id: 2,
      name: "مصفوفة الأولويات",
      description: "أداة لتحديد المهام المهمة والطارئة"
    },
    {
      id: 3,
      name: "مخطط بومودورو",
      description: "جدول لتطبيق تقنية بومودورو"
    }
  ];

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">نصائح الإنتاجية</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          موارد عملية للحصول على الإلهام وزيادة الإنتاجية في الحياة والعمل
        </p>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">عن الإنتاجية</h2>
          <p className="text-gray-700 mb-4">
            الإنتاجية ليست مجرد العمل لساعات أطول، بل هي العمل بذكاء. في هذا القسم، 
            نقدم لك موارد ممتازة تساعدك على تحسين أدائك اليومي وتحقيق نتائج أفضل 
            مع استخدام أكثر كفاءة للوقت والطاقة.
          </p>
          <p className="text-gray-700">
            نركز على الموارد العملية التي يمكنك تطبيقها فوراً في حياتك اليومية 
            لتحسين الأداء في العمل والحياة الشخصية.
          </p>
        </div>

        {/* Productivity Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {productivityTips.map(tip => (
            <div key={tip.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-4xl mb-4">{tip.icon}</div>
              <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
              <p className="text-gray-600 mb-3">{tip.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700">{tip.details}</p>
              </div>
              <span className="inline-block mt-4 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {tip.category}
              </span>
            </div>
          ))}
        </div>

        {/* Featured Productivity Tools */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">أدوات إنتاجية مميزة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productivityTools.map(tool => (
              <div key={tool.id} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                  تحميل
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Categories */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">أقسام الإنتاجية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">التركيز والانتباه</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>تقنيات تقليل التشتت</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>أفضل الأوقات للعمل الإبداعي</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>تمارين تحسين الانتباه</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>التعامل مع المقاطعات</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">التنظيم والجدولة</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>أساليب تنظيم الوقت</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>تحديد الأولويات بفعالية</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>جدولة المهام الصعبة</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>مصفوفة المهام</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">التحفيز والتحصيل</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>الحفاظ على الحماسة</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>التعامل مع الإحباط</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>تحقيق الأهداف الطويلة المدى</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>التحسين المستمر</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Productivity Assessment */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">تقييم إنتاجيتك</h2>
          <p className="text-gray-700 text-center mb-8">
            استخدم هذا التقييم لتحديد نقاط القوة والضعف في إدارتك للوقت والطاقة
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-3">1. هل تحدد أولويات مهامك يومياً؟</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="q1" className="ml-2" /> نعم، دائماً
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q1" className="ml-2" /> في معظم الأحيان
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q1" className="ml-2" /> نادراً
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">2. هل تستخدم تقنيات لتحسين التركيز؟</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="q2" className="ml-2" /> نعم، تقنيات متقدمة
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q2" className="ml-2" /> أحاول تقنيات بسيطة
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q2" className="ml-2" /> لا، لا أستخدم
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3">3. هل تحقق من تقدمك بانتظام؟</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="q3" className="ml-2" /> يومياً
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q3" className="ml-2" /> أسبوعياً
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q3" className="ml-2" /> نادراً
                </label>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
              إرسال التقييم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productivity;