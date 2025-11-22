import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Goals = () => {
  const [dailyGoals, setDailyGoals] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [monthlyGoals, setMonthlyGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [goalType, setGoalType] = useState('daily');

  const addGoal = () => {
    if (newGoal.trim() === '') return;

    const goal = {
      id: Date.now(),
      text: newGoal,
      completed: false,
      createdAt: new Date().toLocaleDateString('ar-EG')
    };

    if (goalType === 'daily') {
      setDailyGoals([...dailyGoals, goal]);
    } else if (goalType === 'weekly') {
      setWeeklyGoals([...weeklyGoals, goal]);
    } else {
      setMonthlyGoals([...monthlyGoals, goal]);
    }

    setNewGoal('');
  };

  const toggleGoal = (id, type) => {
    if (type === 'daily') {
      setDailyGoals(dailyGoals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ));
    } else if (type === 'weekly') {
      setWeeklyGoals(weeklyGoals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ));
    } else {
      setMonthlyGoals(monthlyGoals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ));
    }
  };

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">الأهداف الشخصية</h1>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">حدد هدفك الجديد</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="اكتب هدفك هنا..."
              className="flex-1 p-3 border border-gray-300 rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="daily">هدف يومي</option>
              <option value="weekly">هدف أسبوعي</option>
              <option value="monthly">هدف شهري</option>
            </select>
            
            <button
              onClick={addGoal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              أضف الهدف
            </button>
          </div>
          
          <p className="text-gray-600 mb-8">
            حدد أهدافك اليومية والأسبوعية والشهرية، مع أدوات لتتبع التقدم وتحقيق الإنجازات، 
            مستوحى من استراتيجيات تحديد الأهداف الواضحة وممارسة التأمل الذاتي التي تعتبر 
            مفاتيح للتنمية الشخصية والمرونة.
          </p>
        </div>

        {/* Daily Goals Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="ml-3">الأهداف اليومية</span>
            <span className="text-2xl">🌅</span>
          </h2>
          
          {dailyGoals.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <p className="text-gray-600">لا توجد أهداف يومية محددة بعد</p>
              <Link to="#" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                تعرف على أفضل الممارسات لتحديد الأهداف اليومية
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyGoals.map(goal => (
                <div 
                  key={goal.id} 
                  className={`p-6 rounded-xl shadow-lg border-2 ${
                    goal.completed 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleGoal(goal.id, 'daily')}
                      className="h-5 w-5"
                    />
                    <span className={`text-sm ${goal.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {goal.createdAt}
                    </span>
                  </div>
                  <p className={`text-lg ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {goal.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Goals Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="ml-3">الأهداف الأسبوعية</span>
            <span className="text-2xl">📅</span>
          </h2>
          
          {weeklyGoals.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <p className="text-gray-600">لا توجد أهداف أسبوعية محددة بعد</p>
              <Link to="#" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                تعرف على كيفية تحديد أهداف أسبوعية فعالة
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weeklyGoals.map(goal => (
                <div 
                  key={goal.id} 
                  className={`p-6 rounded-xl shadow-lg border-2 ${
                    goal.completed 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleGoal(goal.id, 'weekly')}
                      className="h-5 w-5"
                    />
                    <span className={`text-sm ${goal.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {goal.createdAt}
                    </span>
                  </div>
                  <p className={`text-lg ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {goal.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Goals Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="ml-3">الأهداف الشهرية</span>
            <span className="text-2xl">🗓️</span>
          </h2>
          
          {monthlyGoals.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <p className="text-gray-600">لا توجد أهداف شهرية محددة بعد</p>
              <Link to="#" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                تعرف على أفضل الطرق لتحديد الأهداف طويلة المدى
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monthlyGoals.map(goal => (
                <div 
                  key={goal.id} 
                  className={`p-6 rounded-xl shadow-lg border-2 ${
                    goal.completed 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleGoal(goal.id, 'monthly')}
                      className="h-5 w-5"
                    />
                    <span className={`text-sm ${goal.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {goal.createdAt}
                    </span>
                  </div>
                  <p className={`text-lg ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {goal.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Tracking Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">تتبع التقدم</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="3"
                    strokeDasharray={`${(dailyGoals.filter(g => g.completed).length / dailyGoals.length) * 100 || 0}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fill="#4ade80" fontSize="8" fontWeight="bold">
                    {dailyGoals.length > 0 ? Math.round((dailyGoals.filter(g => g.completed).length / dailyGoals.length) * 100) : 0}%
                  </text>
                </svg>
              </div>
              <h3 className="font-bold">الأهداف اليومية</h3>
              <p className="text-gray-600">
                {dailyGoals.filter(g => g.completed).length} من {dailyGoals.length} مكتملة
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeDasharray={`${(weeklyGoals.filter(g => g.completed).length / weeklyGoals.length) * 100 || 0}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="bold">
                    {weeklyGoals.length > 0 ? Math.round((weeklyGoals.filter(g => g.completed).length / weeklyGoals.length) * 100) : 0}%
                  </text>
                </svg>
              </div>
              <h3 className="font-bold">الأهداف الأسبوعية</h3>
              <p className="text-gray-600">
                {weeklyGoals.filter(g => g.completed).length} من {weeklyGoals.length} مكتملة
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    strokeDasharray={`${(monthlyGoals.filter(g => g.completed).length / monthlyGoals.length) * 100 || 0}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">
                    {monthlyGoals.length > 0 ? Math.round((monthlyGoals.filter(g => g.completed).length / monthlyGoals.length) * 100) : 0}%
                  </text>
                </svg>
              </div>
              <h3 className="font-bold">الأهداف الشهرية</h3>
              <p className="text-gray-600">
                {monthlyGoals.filter(g => g.completed).length} من {monthlyGoals.length} مكتملة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;