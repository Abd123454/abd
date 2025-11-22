import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Habits = () => {
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "قراءة 30 دقيقة",
      days: [true, true, false, true, false, true, true],
      streak: 5,
      completedToday: false
    },
    {
      id: 2,
      name: "تمارين رياضية",
      days: [true, false, true, true, false, false, true],
      streak: 2,
      completedToday: false
    },
    {
      id: 3,
      name: "التأمل 10 دقائق",
      days: [true, true, true, false, true, true, false],
      streak: 4,
      completedToday: false
    }
  ]);
  
  const [newHabit, setNewHabit] = useState('');

  const addHabit = () => {
    if (newHabit.trim() === '') return;

    const habit = {
      id: Date.now(),
      name: newHabit,
      days: [false, false, false, false, false, false, false],
      streak: 0,
      completedToday: false
    };

    setHabits([...habits, habit]);
    setNewHabit('');
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newDays = [...habit.days];
        newDays[6] = !habit.completedToday; // Today is the last day (index 6 for this week)
        
        // Calculate new streak
        let newStreak = habit.streak;
        if (!habit.completedToday) {
          newStreak += 1;
        } else {
          newStreak = Math.max(0, newStreak - 1);
        }
        
        return {
          ...habit,
          days: newDays,
          streak: newStreak,
          completedToday: !habit.completedToday
        };
      }
      return habit;
    }));
  };

  const daysOfWeek = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">العادات اليومية</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          أدوات لبناء العادات الإيجابية وكسر العادات السيئة مع تذكيرات يومية وإحصائيات مرئية
        </p>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">عن بناء العادات</h2>
          <p className="text-gray-700 mb-4">
            العادات هي العمود الفقري لأي تغيير دائم في الحياة. من خلال بناء عادات إيجابية 
            وتتبع تقدمك بانتظام، يمكنك تحسين جودة حياتك بشكل مستمر.
          </p>
          <p className="text-gray-700">
            استخدم أدواتنا لتتبع عاداتك اليومية وراقب تقدمك مع مرور الوقت. تذكر أن بناء 
            العادة يستغرق في المتوسط 66 يوماً، لذا كن صبوراً مع نفسك.
          </p>
        </div>

        {/* Add New Habit */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">إضافة عادة جديدة</h2>
          <div className="flex">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="اسم العادة الجديدة..."
              className="flex-1 p-3 border border-gray-300 rounded-lg ml-2"
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <button
              onClick={addHabit}
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              إضافة
            </button>
          </div>
        </div>

        {/* Habits List */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6">العادات الحالية</h2>
          
          {habits.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <p className="text-gray-600">لا توجد عادات محددة بعد</p>
              <p className="text-gray-600 mt-2">أضف عادة جديدة لبدء رحلتك</p>
            </div>
          ) : (
            <div className="space-y-6">
              {habits.map(habit => (
                <div key={habit.id} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{habit.name}</h3>
                    <div className="flex items-center">
                      <span className="ml-4 text-gray-600">متتالية: {habit.streak} يوم</span>
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-12 h-6 rounded-full p-1 transition duration-300 ${
                          habit.completedToday ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                            habit.completedToday ? 'transform translate-x-6' : ''
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {daysOfWeek.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-sm text-gray-600 mb-1">{day}</span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            habit.days[index] ? 'bg-green-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          {habit.days[index] ? '✓' : index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Habit Building Tips */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">نصائح لبناء العادات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">ابدأ بخطوات صغيرة</h3>
              <p className="text-gray-700">
                لا تحاول تغيير كل شيء في وقت واحد. ابدأ بخطوات صغيرة وقابلة للتحقيق 
                لتزيد من احتمال استمرارك.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">استخدم المكافآت</h3>
              <p className="text-gray-700">
                عزز السلوكيات الجيدة بمكافآت بسيطة. المكافآت تساعد على ترسيخ العادة 
                في عقلك بشكل أسرع.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">ابحث عن الدعم</h3>
              <p className="text-gray-700">
                شارك رحلتك مع الأصدقاء أو انضم إلى مجتمع دعم. وجود من يشجعك يزيد من 
                احتمال نجاحك في ترسيخ العادة.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">كن صبوراً مع نفسك</h3>
              <p className="text-gray-700">
                من الطبيعي أن تواجه انتكاسات. لا تجعل اليوم السيء يفسد الأسبوع. 
                استمر في المحاولة وركز على التقدم وليس الكمال.
              </p>
            </div>
          </div>
        </div>

        {/* Habit Categories */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">أمثلة على العادات الإيجابية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-3">الصحة واللياقة</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• شرب 8 أكواب ماء يومياً</li>
                <li>• التمرين 30 دقيقة</li>
                <li>• النوم 7-8 ساعات</li>
                <li>• الإفطار الصحي</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-3">التعلم والتطوير</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• قراءة 30 دقيقة يومياً</li>
                <li>• تعلم مهارة جديدة</li>
                <li>• كتابة المعرفة</li>
                <li>• ممارسة التأمل</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-3">الإنتاجية</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• تنظيم المهام يومياً</li>
                <li>• تحديد الأولويات</li>
                <li>• تقليل التشتت</li>
                <li>• مراجعة الأداء</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Habits;