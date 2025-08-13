import { useState } from 'react';
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: 'مراجعة الفصل الأول في الرياضيات', priority: 'high', subject: 'الرياضيات' },
      { id: 2, title: 'حل تمارين الفيزياء صفحة 45', priority: 'medium', subject: 'الفيزياء' },
      { id: 3, title: 'قراءة نص أدبي في العربية', priority: 'low', subject: 'اللغة العربية' },
    ],
    inProgress: [
      { id: 4, title: 'كتابة تقرير الكيمياء', priority: 'high', subject: 'الكيمياء' },
      { id: 5, title: 'حفظ قصيدة المتنبي', priority: 'medium', subject: 'اللغة العربية' },
    ],
    done: [
      { id: 6, title: 'مراجعة قوانين الفيزياء', priority: 'high', subject: 'الفيزياء' },
      { id: 7, title: 'حل واجب الرياضيات', priority: 'medium', subject: 'الرياضيات' },
    ],
  });

  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const columns = [
    {
      id: 'todo',
      title: 'المهام المطلوبة',
      icon: ClipboardDocumentListIcon,
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'inProgress',
      title: 'قيد التنفيذ',
      icon: ClockIcon,
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      id: 'done',
      title: 'مكتملة',
      icon: CheckCircleIcon,
      color: 'border-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  const priorityLabels = {
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
  };

  const addTask = () => {
    if (!newTask.trim() || !newTaskSubject.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask,
      priority: newTaskPriority,
      subject: newTaskSubject,
    };

    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, task],
    }));

    setNewTask('');
    setNewTaskSubject('');
    setShowAddForm(false);
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    const task = tasks[fromColumn].find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(t => t.id !== taskId),
      [toColumn]: [...prev[toColumn], task],
    }));
  };

  const deleteTask = (taskId, column) => {
    setTasks(prev => ({
      ...prev,
      [column]: prev[column].filter(t => t.id !== taskId),
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ClipboardDocumentListIcon className="h-8 w-8 text-primary-500" />
            إدارة المهام
          </h1>
          <p className="text-gray-400">
            نظم مهامك الدراسية وتابع تقدمك بسهولة
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          إضافة مهمة جديدة
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">إضافة مهمة جديدة</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="عنوان المهمة..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus-ring"
            />

            <input
              type="text"
              placeholder="المادة..."
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus-ring"
            />

            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus-ring"
            >
              <option value="high">أولوية عالية</option>
              <option value="medium">أولوية متوسطة</option>
              <option value="low">أولوية منخفضة</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={addTask} className="btn-primary">
              إضافة المهمة
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(column => {
          const Icon = column.icon;
          const columnTasks = tasks[column.id];

          return (
            <div key={column.id} className="space-y-4">
              {/* Column Header */}
              <div className={`card ${column.bgColor} border-2 ${column.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-white" />
                    <h2 className="text-lg font-semibold text-white">
                      {column.title}
                    </h2>
                  </div>
                  <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-3 min-h-[400px]">
                {columnTasks.map(task => (
                  <div
                    key={task.id}
                    className="card hover:scale-105 transition-transform duration-200 cursor-move"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-white leading-tight">
                          {task.title}
                        </h3>
                        <button
                          onClick={() => deleteTask(task.id, column.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {task.subject}
                        </span>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}
                          />
                          <span className="text-xs text-gray-400">
                            {priorityLabels[task.priority]}
                          </span>
                        </div>
                      </div>

                      {/* Move Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-gray-700">
                        {column.id !== 'todo' && (
                          <button
                            onClick={() => moveTask(task.id, column.id, 'todo')}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            إلى المطلوبة
                          </button>
                        )}
                        {column.id !== 'inProgress' && (
                          <button
                            onClick={() => moveTask(task.id, column.id, 'inProgress')}
                            className="text-xs px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                          >
                            إلى قيد التنفيذ
                          </button>
                        )}
                        {column.id !== 'done' && (
                          <button
                            onClick={() => moveTask(task.id, column.id, 'done')}
                            className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            إلى مكتملة
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Icon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد مهام في هذا القسم</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}