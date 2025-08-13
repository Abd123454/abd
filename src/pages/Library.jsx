import { useState } from 'react';
import {
  BookOpenIcon,
  PlayIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const subjects = [
    { id: 'all', name: 'جميع المواد' },
    { id: 'math', name: 'الرياضيات' },
    { id: 'physics', name: 'الفيزياء' },
    { id: 'chemistry', name: 'الكيمياء' },
    { id: 'arabic', name: 'اللغة العربية' },
    { id: 'english', name: 'اللغة الإنجليزية' },
    { id: 'history', name: 'التاريخ' },
    { id: 'geography', name: 'الجغرافيا' },
  ];

  const resources = [
    {
      id: 1,
      title: 'كتاب الرياضيات - الوحدة الأولى',
      subject: 'math',
      type: 'pdf',
      size: '15.2 MB',
      downloads: 1250,
      thumbnail: 'https://images.pexels.com/photos/6256/mathematics-blackboard-education-classroom.jpg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 2,
      title: 'شرح الدوال الرياضية',
      subject: 'math',
      type: 'video',
      duration: '45:30',
      views: 3420,
      thumbnail: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 3,
      title: 'قوانين الفيزياء الأساسية',
      subject: 'physics',
      type: 'pdf',
      size: '8.7 MB',
      downloads: 890,
      thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 4,
      title: 'تجارب الكيمياء العملية',
      subject: 'chemistry',
      type: 'video',
      duration: '32:15',
      views: 2100,
      thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 5,
      title: 'قواعد اللغة العربية',
      subject: 'arabic',
      type: 'pdf',
      size: '12.4 MB',
      downloads: 1680,
      thumbnail: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 6,
      title: 'محادثات اللغة الإنجليزية',
      subject: 'english',
      type: 'video',
      duration: '28:45',
      views: 1950,
      thumbnail: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <BookOpenIcon className="h-8 w-8 text-primary-500" />
          المكتبة التعليمية
        </h1>
        <p className="text-gray-400">
          مجموعة شاملة من الكتب والفيديوهات التعليمية لجميع مواد التوجيهي
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث في المكتبة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus-ring"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus-ring"
          >
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus-ring"
          >
            <option value="all">جميع الأنواع</option>
            <option value="pdf">كتب PDF</option>
            <option value="video">فيديوهات</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center text-gray-400">
            <FunnelIcon className="h-5 w-5 ml-2" />
            {filteredResources.length} نتيجة
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div key={resource.id} className="card hover:scale-105 transition-transform duration-200 group">
            {/* Thumbnail */}
            <div className="relative mb-4 rounded-lg overflow-hidden">
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {resource.type === 'video' ? (
                  <PlayIcon className="h-12 w-12 text-white" />
                ) : (
                  <BookOpenIcon className="h-12 w-12 text-white" />
                )}
              </div>
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  resource.type === 'video' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {resource.type === 'video' ? 'فيديو' : 'PDF'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-lg leading-tight">
                {resource.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>
                  {subjects.find(s => s.id === resource.subject)?.name}
                </span>
                <span>
                  {resource.type === 'video' 
                    ? `${resource.duration} | ${resource.views} مشاهدة`
                    : `${resource.size} | ${resource.downloads} تحميل`
                  }
                </span>
              </div>

              {/* Action Button */}
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                {resource.type === 'video' ? (
                  <>
                    <PlayIcon className="h-5 w-5" />
                    مشاهدة
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    تحميل
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500">
            جرب تغيير معايير البحث أو المرشحات
          </p>
        </div>
      )}
    </div>
  );
}