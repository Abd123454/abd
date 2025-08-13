import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  FireIcon,
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [progress, setProgress] = useState(65);
  const [streak, setStreak] = useState(7);
  const [todayTasks, setTodayTasks] = useState(3);
  const [completedTasks, setCompletedTasks] = useState(2);

  const dailyTips = [
    "ابدأ يومك بمراجعة سريعة للمواد الصعبة",
    "خذ استراحة كل 25 دقيقة من الدراسة",
    "اشرب الماء بانتظام للحفاظ على التركيز",
    "نظم مكان دراستك قبل البدء",
    "راجع ما تعلمته قبل النوم"
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % dailyTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'التقدم العام',
      value: `${progress}%`,
      icon: ChartBarIcon,
      color: 'from-primary-500 to-primary-600',
    },
    {
      title: 'أيام متتالية',
      value: `${streak} أيام`,
      icon: FireIcon,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'المهام المكتملة',
      value: `${completedTasks}/${todayTasks}`,
      icon: CheckCircleIcon,
      color: 'from-success-500 to-success-600',
    },
    {
      title: 'ساعات الدراسة',
      value: '4.5 ساعة',
      icon: ClockIcon,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const weeklyGoals = [
    { subject: 'الرياضيات', progress: 80, target: 'حل 50 مسألة' },
    { subject: 'الفيزياء', progress: 60, target: 'مراجعة 3 فصول' },
    { subject: 'الكيمياء', progress: 90, target: 'حفظ المعادلات' },
    { subject: 'اللغة العربية', progress: 45, target: 'قراءة 5 نصوص' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          مرحباً بك في Tawjihi+ 🎓
        </h1>
        <p className="text-gray-400">
          منصتك المجانية للتفوق في التوجيهي
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Progress */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrophyIcon className="h-6 w-6 text-yellow-500" />
            التقدم العام
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">مستوى الإنجاز</span>
              <span className="text-primary-400 font-semibold">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              أنت في المسار الصحيح! استمر في التقدم المميز
            </p>
          </div>
        </div>

        {/* Daily Tip */}
        <div className="card bg-gradient-to-br from-primary-600 to-success-600">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            💡 نصيحة اليوم
          </h2>
          <p className="text-white text-lg leading-relaxed">
            {dailyTips[currentTip]}
          </p>
          <div className="flex justify-center mt-4 space-x-2 space-x-reverse">
            {dailyTips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTip ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <BookOpenIcon className="h-6 w-6 text-primary-500" />
          الأهداف الأسبوعية
        </h2>
        <div className="space-y-4">
          {weeklyGoals.map((goal, index) => (
            <div key={index} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-white">{goal.subject}</h3>
                <span className="text-sm text-gray-300">{goal.progress}%</span>
              </div>
              <div className="progress-bar mb-2">
                <div 
                  className="progress-fill" 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">{goal.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="card hover:bg-gray-700 transition-colors text-center group">
          <ClockIcon className="h-12 w-12 text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-white mb-2">ابدأ جلسة بومودورو</h3>
          <p className="text-gray-400 text-sm">25 دقيقة تركيز مكثف</p>
        </button>

        <button className="card hover:bg-gray-700 transition-colors text-center group">
          <BookOpenIcon className="h-12 w-12 text-success-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-white mb-2">تصفح المكتبة</h3>
          <p className="text-gray-400 text-sm">كتب وفيديوهات تعليمية</p>
        </button>

        <button className="card hover:bg-gray-700 transition-colors text-center group">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-white mb-2">وضع الطوارئ</h3>
          <p className="text-gray-400 text-sm">مراجعة سريعة قبل الامتحان</p>
        </button>
      </div>
    </div>
  );
}