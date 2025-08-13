import {
  HeartIcon,
  GiftIcon,
  UserGroupIcon,
  AcademicCapIcon,
  SparklesIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

export default function About() {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'تعليم مجاني',
      description: 'جميع المحتويات والأدوات متاحة مجاناً لجميع الطلاب',
    },
    {
      icon: SparklesIcon,
      title: 'أدوات ذكية',
      description: 'مؤقت البومودورو، خطة المذاكرة الذكية، ووضع الطوارئ',
    },
    {
      icon: UserGroupIcon,
      title: 'مجتمع داعم',
      description: 'منصة تفاعلية تجمع طلاب التوجيهي في فلسطين',
    },
    {
      icon: GlobeAltIcon,
      title: 'متاح دائماً',
      description: 'ادرس في أي وقت ومن أي مكان عبر الإنترنت',
    },
  ];

  const stats = [
    { number: '100%', label: 'مجاني' },
    { number: '24/7', label: 'متاح' },
    { number: '∞', label: 'لا محدود' },
    { number: '🇵🇸', label: 'فلسطيني' },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-success-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-white">T+</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          مرحباً بك في Tawjihi+
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          منصة تعليمية مجانية بالكامل، مصممة خصيصاً لطلاب التوجيهي في فلسطين.
          هدفنا مساعدتك على التفوق والنجاح باستخدام أحدث الأدوات التعليمية الذكية.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">
              {stat.number}
            </div>
            <div className="text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="card bg-gradient-to-br from-primary-600 to-success-600">
        <div className="text-center">
          <HeartIcon className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            لماذا Tawjihi+ مجاني؟
          </h2>
          <p className="text-lg text-white leading-relaxed max-w-2xl mx-auto">
            نؤمن بأن التعليم حق للجميع. كل طالب في فلسطين يستحق الحصول على أفضل الأدوات التعليمية
            دون أي عوائق مالية. هذه مساهمتنا في بناء جيل متعلم ومتفوق.
          </p>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          ما يميز منصتنا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card hover:scale-105 transition-transform duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-600 rounded-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donation Section */}
      <div className="card bg-gradient-to-br from-yellow-600 to-orange-600">
        <div className="text-center">
          <GiftIcon className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            ادعم تطوير المنصة
          </h2>
          <p className="text-lg text-white mb-6 leading-relaxed">
            إذا كانت المنصة مفيدة لك، يمكنك دعم تطويرها وإضافة المزيد من المميزات.
            تبرعك يساعدنا في الحفاظ على المنصة مجانية للجميع.
          </p>
          
          <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              أرقام التبرع
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 text-white">
                <span className="font-mono text-lg">0593060783</span>
                <button 
                  onClick={() => navigator.clipboard.writeText('0593060783')}
                  className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                >
                  نسخ
                </button>
              </div>
              <div className="flex items-center justify-center gap-3 text-white">
                <span className="font-mono text-lg">0595051437</span>
                <button 
                  onClick={() => navigator.clipboard.writeText('0595051437')}
                  className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                >
                  نسخ
                </button>
              </div>
            </div>
            <p className="text-sm text-yellow-100 mt-4">
              جميع التبرعات تُستخدم لتطوير المنصة فقط
            </p>
          </div>
        </div>
      </div>

      {/* Future Plans */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          الخطط المستقبلية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-400">
              الإصدار القادم
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-success-400">✓</span>
                مساعد ذكي مدعوم بالذكاء الاصطناعي
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success-400">✓</span>
                غرف الدراسة الجماعية
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success-400">✓</span>
                تطبيق الهاتف المحمول
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success-400">✓</span>
                نظام النقاط والشارات
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-400">
              التوسع المستقبلي
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">⏳</span>
                دعم طلاب الأردن
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">⏳</span>
                محتوى تفاعلي متقدم
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">⏳</span>
                اقتراح المسارات المهنية
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">⏳</span>
                التعلم بدون إنترنت
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          تواصل معنا
        </h2>
        <p className="text-gray-400 mb-6">
          لديك اقتراح أو تواجه مشكلة؟ نحن هنا لمساعدتك
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary">
            إرسال رسالة
          </button>
          <button className="btn-secondary">
            انضم لمجتمعنا
          </button>
        </div>
      </div>

      {/* Footer Message */}
      <div className="text-center py-8">
        <p className="text-gray-400 text-lg">
          صُنع بـ <HeartIcon className="h-5 w-5 text-red-500 inline mx-1" /> في فلسطين
        </p>
        <p className="text-gray-500 text-sm mt-2">
          من أجل طلاب التوجيهي الأعزاء - نتمنى لكم التوفيق والنجاح 🎓
        </p>
      </div>
    </div>
  );
}