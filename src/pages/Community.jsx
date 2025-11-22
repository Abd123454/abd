import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "أحمد محمد",
      content: "مرحباً بالجميع! أرغب في مشاركة تجربتي في بناء عادة القراءة اليومية. بدأت قبل شهرين بقراءة 10 دقائق يومياً، والآن أقرأ ساعة كاملة يومياً. ما هي العادات التي ترغبون في بنائها؟",
      likes: 24,
      comments: 8,
      time: "منذ 2 ساعات",
      category: "العادات"
    },
    {
      id: 2,
      author: "فاطمة علي",
      content: "أحتاج إلى دعم في التحفيز للانتهاء من مشاريعي. أشعر أحياناً بالإحباط لكنني أريد الاستمرار. هل من تجارب مماثلة؟",
      likes: 42,
      comments: 15,
      time: "منذ 5 ساعات",
      category: "التحفيز"
    },
    {
      id: 3,
      author: "محمد سعيد",
      content: "تم بحمد الله تحقيق هدفي الشهري المتعلق بتعلم لغة جديدة! كنت أهدف إلى تعلم 50 كلمة جديدة شهرياً، وتم تحقيق الهدف. أشعر بالفخر والتحفيز لتحديد هدف جديد.",
      likes: 68,
      comments: 12,
      time: "منذ يوم",
      category: "الأهداف"
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('عام');

  const categories = ['عام', 'العادات', 'الأهداف', 'التحفيز', 'الإنتاجية', 'الصحة النفسية'];

  const addPost = () => {
    if (newPost.trim() === '') return;

    const post = {
      id: Date.now(),
      author: "أنت",
      content: newPost,
      likes: 0,
      comments: 0,
      time: "للتو",
      category: selectedCategory
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const toggleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">مجتمع الدعم</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          انضم إلى مجتمع تفاعلي لمشاركة تجاربك ونصائحك مع الآخرين
        </p>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">عن مجتمعنا</h2>
          <p className="text-gray-700 mb-4">
            مجتمع الدعم لدينا مستوحى من مجتمعات مثل Reddit's GetDisciplined و GetMotivated و LifeImprovement.
            نؤمن بأن مشاركة التجارب والنصائح مع الآخرين تساهم بشكل كبير في تحفيز الأفراد ومساعدتهم على 
            تجاوز التحديات في رحلتهم نحو التطور الشخصي.
          </p>
          <p className="text-gray-700">
            هذا المكان مخصص لمشاركة قصص النجاح، طلب الدعم، وتبادل النصائح المفيدة مع أشخاص يسعون 
            جميعهم إلى تحسين أنفسهم وحياتهم.
          </p>
        </div>

        {/* Create Post Section */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">مشاركة جديدة</h2>
          
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="شارك تجربتك أو اطلب الدعم..."
              className="w-full p-3 border border-gray-300 rounded-lg h-24"
            />
          </div>
          
          <button
            onClick={addPost}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            مشاركة
          </button>
        </div>

        {/* Community Posts */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">آخر المشاركات</h2>
          
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-lg mb-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-lg mt-2">{post.author}</h3>
                </div>
                <span className="text-gray-500 text-sm">{post.time}</span>
              </div>
              
              <p className="text-gray-700 mb-4">{post.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center text-gray-500 hover:text-red-500"
                  >
                    <span className="ml-1">❤️</span>
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-500">
                    <span className="ml-1">💬</span>
                    <span>{post.comments}</span>
                  </button>
                </div>
                <button className="text-gray-500 hover:text-blue-500">
                  ⬇️ مشاركة
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Community Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">مميزات مجتمعنا</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-3">منتديات النقاش</h3>
              <p className="text-gray-600">
                شارك تجاربك وتعلم من الآخرين في بيئة داعمة ومتحفزة
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">م	groups_ الدعم</h3>
              <p className="text-gray-600">
                انضم إلى مجموعات تفاعلية للتحفيز والدعم المتبادل
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-xl font-bold mb-3">الفعاليات الحية</h3>
              <p className="text-gray-600">
                ورش عمل ومحاضرات مباشرة مع خبراء التطوير الذاتي
              </p>
            </div>
          </div>
        </div>

        {/* External Communities Section */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">مجتمعات خارجية موصى بها</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-bold mb-2">r/GetDisciplined</h3>
              <p className="text-sm text-gray-600 mb-3">مجتمع رديت لبناء الانضباط الذاتي</p>
              <a href="https://www.reddit.com/r/GetDisciplined/" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                زيارة المجتمع →
              </a>
            </div>
            
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-bold mb-2">r/GetMotivated</h3>
              <p className="text-sm text-gray-600 mb-3">مجتمع للتحفيز والتحفيز المتبادل</p>
              <a href="https://www.reddit.com/r/GetMotivated/" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                زيارة المجتمع →
              </a>
            </div>
            
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="font-bold mb-2">r/LifeImprovement</h3>
              <p className="text-sm text-gray-600 mb-3">مجتمع لتحسين جودة الحياة</p>
              <a href="https://www.reddit.com/r/LifeImprovement/" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                زيارة المجتمع →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;