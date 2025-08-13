import { useState } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function StudyPlan() {
  const [daysLeft, setDaysLeft] = useState('');
  const [subjects, setSubjects] = useState([
    { name: 'الرياضيات', hours: 0, priority: 'high', completed: false },
    { name: 'الفيزياء', hours: 0, priority: 'high', completed: false },
    { name: 'الكيمياء', hours: 0, priority: 'medium', completed: false },
    { name: 'اللغة العربية', hours: 0, priority: 'medium', completed: false },
    { name: 'اللغة الإنجليزية', hours: 0, priority: 'low', completed: false },
    { name: 'التاريخ', hours: 0, priority: 'low', completed: false },
  ]);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [showCustomSubjects, setShowCustomSubjects] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  };

  const priorityLabels = {
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
  };

  const updateSubjectHours = (index, hours) => {
    const newSubjects = [...subjects];
    newSubjects[index].hours = parseInt(hours) || 0;
    setSubjects(newSubjects);
  };

  const updateSubjectPriority = (index, priority) => {
    const newSubjects = [...subjects];
    newSubjects[index].priority = priority;
    setSubjects(newSubjects);
  };

  const addCustomSubject = () => {
    if (!newSubject.trim()) return;
    
    setSubjects([...subjects, {
      name: newSubject,
      hours: 0,
      priority: 'medium',
      completed: false,
    }]);
    setNewSubject('');
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const generatePlan = () => {
    if (!daysLeft || daysLeft <= 0) {
      alert('يرجى إدخال عدد الأيام المتبقية');
      return;
    }

    const totalHours = subjects.reduce((sum, subject) => sum + subject.hours, 0);
    if (totalHours === 0) {
      alert('يرجى إدخال ساعات الدراسة لكل مادة');
      return;
    }

    // Sort subjects by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const sortedSubjects = [...subjects].sort((a, b) => 
      priorityOrder[b.priority] - priorityOrder[a.priority]
    );

    const dailyHours = Math.ceil(totalHours / daysLeft);
    const plan = [];

    // Distribute subjects across days
    let currentDay = 1;
    let currentDayHours = 0;
    let subjectIndex = 0;
    let remainingHours = [...sortedSubjects.map(s => s.hours)];

    while (currentDay <= daysLeft && remainingHours.some(h => h > 0)) {
      if (!plan[currentDay - 1]) {
        plan[currentDay - 1] = {
          day: currentDay,
          subjects: [],
          totalHours: 0,
        };
      }

      const subject = sortedSubjects[subjectIndex];
      const hoursToAdd = Math.min(
        remainingHours[subjectIndex],
        dailyHours - currentDayHours,
        3 // Max 3 hours per subject per day
      );

      if (hoursToAdd > 0) {
        plan[currentDay - 1].subjects.push({
          name: subject.name,
          hours: hoursToAdd,
          priority: subject.priority,
        });
        plan[currentDay - 1].totalHours += hoursToAdd;
        remainingHours[subjectIndex] -= hoursToAdd;
        currentDayHours += hoursToAdd;
      }

      // Move to next subject
      subjectIndex = (subjectIndex + 1) % sortedSubjects.length;

      // If day is full or we've cycled through all subjects, move to next day
      if (currentDayHours >= dailyHours || 
          (subjectIndex === 0 && !remainingHours.some(h => h > 0))) {
        currentDay++;
        currentDayHours = 0;
      }
    }

    setGeneratedPlan(plan);
  };

  const toggleSubjectCompletion = (dayIndex, subjectIndex) => {
    const newPlan = [...generatedPlan];
    newPlan[dayIndex].subjects[subjectIndex].completed = 
      !newPlan[dayIndex].subjects[subjectIndex].completed;
    setGeneratedPlan(newPlan);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <CalendarDaysIcon className="h-8 w-8 text-primary-500" />
          خطة المذاكرة الذكية
        </h1>
        <p className="text-gray-400">
          أنشئ خطة دراسة مخصصة بناءً على الوقت المتاح والمواد المطلوبة
        </p>
      </div>

      {/* Input Form */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-6">إعداد الخطة</h2>
        
        {/* Days Left */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">عدد الأيام المتبقية للامتحان</label>
          <input
            type="number"
            value={daysLeft}
            onChange={(e) => setDaysLeft(e.target.value)}
            placeholder="مثال: 30"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus-ring"
          />
        </div>

        {/* Subjects */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-300">المواد وساعات الدراسة المطلوبة</label>
            <button
              onClick={() => setShowCustomSubjects(!showCustomSubjects)}
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              إضافة مادة مخصصة
            </button>
          </div>

          {/* Custom Subject Input */}
          {showCustomSubjects && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="اسم المادة..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus-ring"
              />
              <button onClick={addCustomSubject} className="btn-primary">
                إضافة
              </button>
            </div>
          )}

          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{subject.name}</span>
                  {subjects.length > 6 && (
                    <button
                      onClick={() => removeSubject(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      حذف
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">ساعات الدراسة</label>
                  <input
                    type="number"
                    value={subject.hours}
                    onChange={(e) => updateSubjectHours(index, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white focus-ring"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">الأولوية</label>
                  <select
                    value={subject.priority}
                    onChange={(e) => updateSubjectPriority(index, e.target.value)}
                    className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white focus-ring"
                  >
                    <option value="high">عالية</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <span className={`text-sm ${priorityColors[subject.priority]}`}>
                    أولوية {priorityLabels[subject.priority]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={generatePlan} className="btn-primary w-full">
          إنشاء الخطة الذكية
        </button>
      </div>

      {/* Generated Plan */}
      {generatedPlan && (
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-success-500" />
            خطة الدراسة المقترحة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedPlan.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">
                    اليوم {day.day}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-sm">{day.totalHours} ساعات</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {day.subjects.map((subject, subjectIndex) => (
                    <div
                      key={subjectIndex}
                      className={`p-3 rounded-lg border-r-4 transition-all duration-200 ${
                        subject.completed
                          ? 'bg-success-500/20 border-success-500'
                          : 'bg-gray-600 border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${
                          subject.completed ? 'text-success-300 line-through' : 'text-white'
                        }`}>
                          {subject.name}
                        </span>
                        <button
                          onClick={() => toggleSubjectCompletion(dayIndex, subjectIndex)}
                          className={`w-5 h-5 rounded-full border-2 transition-colors ${
                            subject.completed
                              ? 'bg-success-500 border-success-500'
                              : 'border-gray-400 hover:border-success-400'
                          }`}
                        >
                          {subject.completed && (
                            <CheckCircleIcon className="w-3 h-3 text-white mx-auto" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {subject.hours} ساعة
                        </span>
                        <span className={priorityColors[subject.priority]}>
                          {priorityLabels[subject.priority]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Plan Summary */}
          <div className="mt-6 p-4 bg-primary-600/20 border border-primary-500 rounded-lg">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-primary-400" />
              ملخص الخطة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">إجمالي الأيام: </span>
                <span className="text-white font-medium">{generatedPlan.length} يوم</span>
              </div>
              <div>
                <span className="text-gray-400">إجمالي الساعات: </span>
                <span className="text-white font-medium">
                  {subjects.reduce((sum, s) => sum + s.hours, 0)} ساعة
                </span>
              </div>
              <div>
                <span className="text-gray-400">متوسط الساعات اليومية: </span>
                <span className="text-white font-medium">
                  {Math.round(subjects.reduce((sum, s) => sum + s.hours, 0) / generatedPlan.length)} ساعة
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}