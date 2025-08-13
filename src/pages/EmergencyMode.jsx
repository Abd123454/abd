import { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  FireIcon,
  BookOpenIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';

export default function EmergencyMode() {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isActive, setIsActive] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(0);
  const [completedSubjects, setCompletedSubjects] = useState([]);

  const emergencySubjects = [
    {
      name: 'الرياضيات',
      priority: 'عالية جداً',
      topics: ['المعادلات', 'الهندسة', 'الإحصاء'],
      color: 'from-red-500 to-red-600',
      icon: '📐',
    },
    {
      name: 'الفيزياء',
      priority: 'عالية',
      topics: ['الحركة', 'الكهرباء', 'الضوء'],
      color: 'from-orange-500 to-orange-600',
      icon: '⚡',
    },
    {
      name: 'الكيمياء',
      priority: 'متوسطة',
      topics: ['التفاعلات', 'الجدول الدوري', 'المحاليل'],
      color: 'from-yellow-500 to-yellow-600',
      icon: '🧪',
    },
    {
      name: 'اللغة العربية',
      priority: 'متوسطة',
      topics: ['النحو', 'البلاغة', 'الأدب'],
      color: 'from-green-500 to-green-600',
      icon: '📚',
    },
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto move to next subject
      if (currentSubject < emergencySubjects.length - 1) {
        setCurrentSubject(prev => prev + 1);
        setTimeLeft(30 * 60);
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentSubject]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const completeSubject = () => {
    if (!completedSubjects.includes(currentSubject)) {
      setCompletedSubjects([...completedSubjects, currentSubject]);
    }
    
    if (currentSubject < emergencySubjects.length - 1) {
      setCurrentSubject(prev => prev + 1);
      setTimeLeft(30 * 60);
      setIsActive(false);
    }
  };

  const skipSubject = () => {
    if (currentSubject < emergencySubjects.length - 1) {
      setCurrentSubject(prev => prev + 1);
      setTimeLeft(30 * 60);
      setIsActive(false);
    }
  };

  const resetSession = () => {
    setCurrentSubject(0);
    setTimeLeft(30 * 60);
    setIsActive(false);
    setCompletedSubjects([]);
  };

  const progress = ((30 * 60) - timeLeft) / (30 * 60) * 100;
  const overallProgress = (completedSubjects.length / emergencySubjects.length) * 100;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500 animate-pulse" />
          وضع الطوارئ
        </h1>
        <p className="text-gray-400">
          مراجعة سريعة ومكثفة قبل الامتحان - 30 دقيقة لكل مادة
        </p>
      </div>

      {/* Emergency Alert */}
      <div className="card bg-gradient-to-r from-red-600 to-orange-600 border-2 border-red-500">
        <div className="flex items-center gap-3 mb-4">
          <FireIcon className="h-8 w-8 text-white animate-pulse" />
          <div>
            <h2 className="text-xl font-bold text-white">🚨 حالة طوارئ نشطة</h2>
            <p className="text-red-100">
              وقت محدود - ركز على النقاط الأساسية فقط
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{formatTime(timeLeft)}</div>
            <div className="text-red-100 text-sm">الوقت المتبقي</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{completedSubjects.length}/{emergencySubjects.length}</div>
            <div className="text-red-100 text-sm">المواد المكتملة</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{Math.round(overallProgress)}%</div>
            <div className="text-red-100 text-sm">التقدم العام</div>
          </div>
        </div>
      </div>

      {/* Current Subject */}
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">
              {emergencySubjects[currentSubject]?.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {emergencySubjects[currentSubject]?.name}
            </h2>
            <p className="text-gray-400">
              أولوية: {emergencySubjects[currentSubject]?.priority}
            </p>
          </div>

          {/* Timer Circle */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-red-500 transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-400">
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`p-3 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isActive ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={completeSubject}
              className="px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors duration-200"
            >
              مكتمل
            </button>

            <button
              onClick={skipSubject}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              تخطي
            </button>
          </div>

          {/* Topics to Focus */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-primary-400" />
              النقاط الأساسية للمراجعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {emergencySubjects[currentSubject]?.topics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-gray-600 rounded-lg p-2 text-center text-white text-sm"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {emergencySubjects.map((subject, index) => (
          <div
            key={index}
            className={`card transition-all duration-200 ${
              index === currentSubject
                ? 'ring-2 ring-red-500 bg-red-500/10'
                : completedSubjects.includes(index)
                ? 'bg-success-500/10 border-success-500'
                : 'opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">{subject.icon}</div>
              {completedSubjects.includes(index) && (
                <CheckCircleIcon className="h-6 w-6 text-success-500" />
              )}
            </div>
            
            <h3 className="font-semibold text-white mb-1">
              {subject.name}
            </h3>
            <p className="text-gray-400 text-sm">
              {subject.priority}
            </p>
            
            {index === currentSubject && (
              <div className="mt-3 progress-bar">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Tips */}
      <div className="card bg-gradient-to-br from-yellow-600 to-orange-600">
        <h3 className="text-lg font-semibold text-white mb-3">
          ⚡ نصائح المراجعة السريعة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-yellow-300">•</span>
              ركز على القوانين والمعادلات الأساسية
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300">•</span>
              راجع الأمثلة المحلولة فقط
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300">•</span>
              اكتب النقاط المهمة على ورقة
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-yellow-300">•</span>
              لا تحاول فهم مفاهيم جديدة
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300">•</span>
              استخدم الذاكرة البصرية (رسوم، مخططات)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300">•</span>
              خذ نفس عميق واشرب الماء
            </li>
          </ul>
        </div>
      </div>

      {/* Reset Button */}
      {completedSubjects.length === emergencySubjects.length && (
        <div className="text-center">
          <div className="card bg-gradient-to-r from-success-600 to-success-700 mb-4">
            <h2 className="text-xl font-bold text-white mb-2">
              🎉 تهانينا! أكملت جلسة الطوارئ
            </h2>
            <p className="text-success-100">
              لقد راجعت جميع المواد الأساسية. حان وقت الامتحان!
            </p>
          </div>
          
          <button
            onClick={resetSession}
            className="btn-primary"
          >
            بدء جلسة جديدة
          </button>
        </div>
      )}
    </div>
  );
}