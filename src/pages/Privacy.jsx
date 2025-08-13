import {
  ShieldCheckIcon,
  LockClosedIcon,
  EyeSlashIcon,
  TrashIcon,
  DocumentTextIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function Privacy() {
  const privacyPrinciples = [
    {
      icon: LockClosedIcon,
      title: 'حماية البيانات',
      description: 'جميع بياناتك محمية بأحدث تقنيات التشفير ولا يمكن الوصول إليها من قبل أطراف ثالثة.',
    },
    {
      icon: EyeSlashIcon,
      title: 'عدم المشاركة',
      description: 'لا نشارك معلوماتك الشخصية مع أي جهة خارجية أو شركات إعلانية.',
    },
    {
      icon: UserIcon,
      title: 'بيانات محدودة',
      description: 'نجمع فقط البيانات الضرورية لتحسين تجربتك التعليمية.',
    },
    {
      icon: TrashIcon,
      title: 'حق الحذف',
      description: 'يمكنك حذف حسابك وجميع بياناتك في أي وقت تشاء.',
    },
  ];

  const dataTypes = [
    {
      category: 'البيانات الأساسية',
      items: ['الاسم (اختياري)', 'البريد الإلكتروني (للتواصل فقط)', 'تفضيلات الدراسة'],
      purpose: 'لتخصيص تجربتك التعليمية',
    },
    {
      category: 'بيانات الاستخدام',
      items: ['تقدمك في المواد', 'إحصائيات الدراسة', 'الأهداف المحققة'],
      purpose: 'لتتبع تقدمك وتحسين الأداء',
    },
    {
      category: 'البيانات التقنية',
      items: ['نوع المتصفح', 'نظام التشغيل', 'إعدادات اللغة'],
      purpose: 'لتحسين أداء المنصة',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <ShieldCheckIcon className="h-8 w-8 text-primary-500" />
          سياسة الخصوصية
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. هذه السياسة توضح كيف نتعامل مع معلوماتك.
        </p>
      </div>

      {/* Last Updated */}
      <div className="card bg-primary-600/20 border border-primary-500">
        <div className="flex items-center gap-3">
          <DocumentTextIcon className="h-6 w-6 text-primary-400" />
          <div>
            <h3 className="font-semibold text-white">آخر تحديث</h3>
            <p className="text-primary-300">يناير 2025</p>
          </div>
        </div>
      </div>

      {/* Privacy Principles */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          مبادئ الخصوصية لدينا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {privacyPrinciples.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <div key={index} className="card hover:scale-105 transition-transform duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-success-600 rounded-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-gray-400">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Collection */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">
          البيانات التي نجمعها
        </h2>
        <div className="space-y-6">
          {dataTypes.map((dataType, index) => (
            <div key={index} className="border-r-4 border-primary-500 pr-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                {dataType.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">البيانات:</h4>
                  <ul className="space-y-1">
                    {dataType.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">الغرض:</h4>
                  <p className="text-gray-400 text-sm">{dataType.purpose}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Security */}
      <div className="card bg-gradient-to-br from-success-600 to-primary-600">
        <div className="text-center text-white">
          <LockClosedIcon className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            أمان البيانات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">تشفير متقدم</h3>
              <p className="text-sm text-gray-100">
                جميع البيانات مشفرة باستخدام معايير الأمان العالمية
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">خوادم آمنة</h3>
              <p className="text-sm text-gray-100">
                بياناتك محفوظة على خوادم محمية ومراقبة 24/7
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">وصول محدود</h3>
              <p className="text-sm text-gray-100">
                فقط الموظفون المخولون يمكنهم الوصول للبيانات الضرورية
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Rights */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">
          حقوقك كمستخدم
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-white">الوصول للبيانات</h3>
                <p className="text-gray-400 text-sm">
                  يمكنك طلب نسخة من جميع بياناتك المحفوظة لدينا
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-white">تصحيح البيانات</h3>
                <p className="text-gray-400 text-sm">
                  يمكنك تعديل أو تصحيح أي معلومات خاطئة
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-white">حذف البيانات</h3>
                <p className="text-gray-400 text-sm">
                  يمكنك طلب حذف حسابك وجميع بياناتك نهائياً
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-white">نقل البيانات</h3>
                <p className="text-gray-400 text-sm">
                  يمكنك طلب نقل بياناتك لخدمة أخرى
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-white">إيقاف المعالجة</h3>
                <p className="text-gray-400 text-sm">
                  يمكنك طلب إيقاف معالجة بياناتك مؤقتاً
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-white">الاعتراض</h3>
                <p className="text-gray-400 text-sm">
                  يمكنك الاعتراض على طريقة استخدام بياناتك
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookies */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4">
          ملفات تعريف الارتباط (Cookies)
        </h2>
        <div className="space-y-4">
          <p className="text-gray-300">
            نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">ملفات ضرورية</h3>
              <p className="text-gray-400 text-sm">
                مطلوبة لعمل المنصة بشكل صحيح (تسجيل الدخول، الإعدادات)
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">ملفات تحليلية</h3>
              <p className="text-gray-400 text-sm">
                تساعدنا في فهم كيفية استخدام المنصة لتحسينها
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="card bg-gradient-to-br from-primary-600 to-success-600">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            أسئلة حول الخصوصية؟
          </h2>
          <p className="mb-6">
            إذا كان لديك أي استفسار حول سياسة الخصوصية أو كيفية التعامل مع بياناتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              تواصل معنا
            </button>
            <button className="bg-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
              حذف الحساب
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">
          نحن ملتزمون بحماية خصوصيتك وشفافية التعامل مع بياناتك.
          <br />
          هذه السياسة قابلة للتحديث، وسنخبرك بأي تغييرات مهمة.
        </p>
      </div>
    </div>
  );
}