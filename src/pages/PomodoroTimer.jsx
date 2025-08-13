import { useState, useEffect, useRef } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ClockIcon,
  EyeSlashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes
  const longBreakTime = 15 * 60; // 15 minutes

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      
      if (!isBreak) {
        // Work session finished
        setSessions(prev => prev + 1);
        const newSessions = sessions + 1;
        
        // Every 4 sessions, take a long break
        if (newSessions % 4 === 0) {
          setTimeLeft(longBreakTime);
          setIsBreak(true);
          showNotification('وقت الراحة الطويلة!', 'لقد أكملت 4 جلسات. خذ راحة 15 دقيقة.');
        } else {
          setTimeLeft(breakTime);
          setIsBreak(true);
          showNotification('وقت الراحة!', 'لقد أكملت جلسة عمل. خذ راحة 5 دقائق.');
        }
      } else {
        // Break finished
        setTimeLeft(workTime);
        setIsBreak(false);
        showNotification('وقت العمل!', 'انتهت فترة الراحة. ابدأ جلسة عمل جديدة.');
      }
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, isBreak, sessions]);

  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      requestNotificationPermission();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? (sessions % 4 === 0 ? longBreakTime : breakTime) : workTime);
  };

  const skipSession = () => {
    setIsActive(false);
    if (!isBreak) {
      setSessions(prev => prev + 1);
      setTimeLeft(breakTime);
      setIsBreak(true);
    } else {
      setTimeLeft(workTime);
      setIsBreak(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((sessions % 4 === 0 ? longBreakTime : breakTime) - timeLeft) / (sessions % 4 === 0 ? longBreakTime : breakTime) * 100
    : (workTime - timeLeft) / workTime * 100;

  const stats = [
    { label: 'الجلسات المكتملة', value: sessions },
    { label: 'الوقت المتبقي', value: formatTime(timeLeft) },
    { label: 'نوع الجلسة', value: isBreak ? 'راحة' : 'عمل' },
    { label: 'التقدم', value: `${Math.round(progress)}%` },
  ];

  return (
    <div className={`space-y-8 animate-fade-in transition-all duration-500 ${
      focusMode ? 'fixed inset-0 bg-gray-900 z-50 p-8 overflow-y-auto' : ''
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ClockIcon className="h-8 w-8 text-primary-500" />
            مؤقت البومودورو
          </h1>
          <p className="text-gray-400">
            تقنية إدارة الوقت للتركيز المكثف - 25 دقيقة عمل، 5 دقائق راحة
          </p>
        </div>

        <button
          onClick={() => setFocusMode(!focusMode)}
          className="btn-secondary flex items-center gap-2"
        >
          {focusMode ? (
            <>
              <EyeIcon className="h-5 w-5" />
              إنهاء وضع التركيز
            </>
          ) : (
            <>
              <EyeSlashIcon className="h-5 w-5" />
              وضع التركيز
            </>
          )}
        </button>
      </div>

      {/* Main Timer */}
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          {/* Timer Display */}
          <div className="relative mb-8">
            <div className="w-64 h-64 mx-auto relative">
              {/* Progress Circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className={`transition-all duration-1000 ${
                    isBreak ? 'text-success-500' : 'text-primary-500'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-6xl font-bold mb-2 ${
                  isBreak ? 'text-success-400' : 'text-primary-400'
                }`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-gray-400">
                  {isBreak ? 'وقت الراحة' : 'وقت العمل'}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={toggleTimer}
              className={`p-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isActive ? (
                <PauseIcon className="h-8 w-8" />
              ) : (
                <PlayIcon className="h-8 w-8" />
              )}
            </button>

            <button
              onClick={resetTimer}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
            >
              <ArrowPathIcon className="h-8 w-8" />
            </button>

            <button
              onClick={skipSession}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              تخطي
            </button>
          </div>

          {/* Session Counter */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index < sessions % 4
                    ? 'bg-primary-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            الجلسة {(sessions % 4) + 1} من 4
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="card bg-gradient-to-br from-primary-600 to-success-600">
        <h3 className="text-lg font-semibold text-white mb-3">
          💡 نصائح للاستفادة القصوى من البومودورو
        </h3>
        <ul className="space-y-2 text-white">
          <li className="flex items-start gap-2">
            <span className="text-yellow-300">•</span>
            اختر مهمة واحدة فقط للتركيز عليها
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-300">•</span>
            أغلق جميع المشتتات (هاتف، إشعارات، مواقع التواصل)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-300">•</span>
            استغل فترة الراحة للحركة أو شرب الماء
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-300">•</span>
            بعد 4 جلسات، خذ راحة طويلة (15-30 دقيقة)
          </li>
        </ul>
      </div>
    </div>
  );
}