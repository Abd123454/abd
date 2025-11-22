import React from 'react';
import { Link } from 'react-router-dom';

const Inspiration = () => {
  const inspirationalQuotes = [
    {
      id: 1,
      text: "الشيء الوحيد الذي يقف بينك وبين حلمك هو الإرادة لمحاولة تحقيقه",
      author: "مؤلف غير معروف"
    },
    {
      id: 2,
      text: "النجاح ليس مفتاح السعادة. السعادة هي مفتاح النجاح. إذا كنت تحب ما تفعله، فستكون ناجحًا",
      author: "ألبرت شفايتزر"
    },
    {
      id: 3,
      text: "الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله",
      author: "ستيف جوبز"
    },
    {
      id: 4,
      text: "لا تدع الخوف من الفشل يمنعك من اللعب",
      author: "بيب روث"
    },
    {
      id: 5,
      text: "الحياة إما مغامرة جريئة أو لا شيء",
      author: "هيلين كيلر"
    },
    {
      id: 6,
      text: "الشخص الذي يوقف أمامك ليس الجدار، بل ظنّك أن الجدار لا يمكن تجاوزه",
      author: "مجهول"
    }
  ];

  const inspirationalStories = [
    {
      id: 1,
      title: "كيف بدأ مشروعه بعد 100 رفض",
      summary: "قصة رائد أعمال بدأ مشروعه بعد أن واجه 100 رفض من المستثمرين، لكنه استمر في المحاولة حتى نجح.",
      date: "15 نوفمبر 2025"
    },
    {
      id: 2,
      title: "التحول من الإحباط إلى الإنجاز",
      summary: "رحلة شاب تغلب على الإحباط وبدأ في تعلم مهارات جديدة، مما أدى إلى تغيير مسار حياته المهنية.",
      date: "12 نوفمبر 2025"
    },
    {
      id: 3,
      title: "النجاح لا ينتظر، ابدأ الآن",
      summary: "قصة امرأة قررت متابعة شغفها رغم الصعوبات، ونجحت في إنشاء مشروعها الخاص بعد سنوات من التردد.",
      date: "10 نوفمبر 2025"
    }
  ];

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">الإلهام اليومي</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          محتوى ملهم يساعدك على اتخاذ خطوات جريئة في حياتك، بدء المشاريع، وكسر الحواجز
        </p>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">عن الإلهام</h2>
          <p className="text-gray-700 mb-4">
            الإلهام هو الشرارة التي تبدأ التغيير. في هذا القسم، نقدم محتوى يهدف إلى تحفيزك 
            وتشجيعك على اتخاذ الخطوات الجريئة في حياتك، بدء مشاريعك، وكسر الحواجز التي 
            تمنعك من التقدم.
          </p>
          <p className="text-gray-700">
            نؤمن أن كل فرد يملك القدرة على تغيير حياته ومجتمعه، ونهدف إلى إشعال تلك القدرة 
            من خلال قصص واقعية ونصائح عملية.
          </p>
        </div>

        {/* Daily Quote Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">الاقتباس اليومي</h2>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">❝</div>
            <blockquote className="text-xl md:text-2xl font-light italic mb-6">
              {inspirationalQuotes[0].text}
            </blockquote>
            <cite className="text-lg opacity-90">- {inspirationalQuotes[0].author}</cite>
          </div>
        </div>

        {/* Inspirational Quotes Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">اقتباسات ملهمة أخرى</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inspirationalQuotes.slice(1).map(quote => (
              <div key={quote.id} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl text-gray-300 mb-4">❝</div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  {quote.text}
                </blockquote>
                <cite className="text-gray-600">- {quote.author}</cite>
              </div>
            ))}
          </div>
        </div>

        {/* Inspirational Stories */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">قصص ملهمة</h2>
          <div className="space-y-8">
            {inspirationalStories.map(story => (
              <div key={story.id} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-3">{story.title}</h3>
                <p className="text-gray-700 mb-4">{story.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{story.date}</span>
                  <Link to="#" className="text-blue-600 font-bold hover:underline">
                    اقرأ القصة الكاملة →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Take Action Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-6">حان الوقت لاتخاذ إجراء</h2>
          <p className="text-lg mb-6">
            لا تنتظر اللحظة المثالية، ابدأ الآن. حتى الخطوة الصغيرة تؤدي إلى تغيير كبير.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <h3 className="font-bold mb-2">حدد هدفك</h3>
              <p className="text-sm">اكتب هدفك بوضوح</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <h3 className="font-bold mb-2">ابدأ الآن</h3>
              <p className="text-sm">خطة بسيطة لليوم</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <h3 className="font-bold mb-2">تابع تقدمك</h3>
              <p className="text-sm">راقب تغييراتك</p>
            </div>
          </div>
          <Link 
            to="/goals" 
            className="mt-6 inline-block bg-white text-orange-500 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300"
          >
            ابدأ رحلتك الآن
          </Link>
        </div>

        {/* Motivational Tips */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">نصائح لتحفيز الذات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-3">ابحث عن السبب</h3>
              <p className="text-gray-700">
                اعرف لماذا ترغب في التغيير. السبب القوي سيساعدك على تجاوز الصعوبات التي قد تواجهك.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-3">احتفل بالإنجازات</h3>
              <p className="text-gray-700">
                احتفل حتى بالإنجازات الصغيرة. هذا يعزز الشعور بالإنجاز ويدفعك للمزيد.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-3">ابحث عن الدعم</h3>
              <p className="text-gray-700">
                ا surrounds نفسك بأشخاص إيجابيين يدعمون رحلتك ويشجعونك على الاستمرار.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg mb-3">كن صبوراً</h3>
              <p className="text-gray-700">
                التغيير الحقيقي يستغرق وقتاً. كن صبوراً مع نفسك وراقب التقدم على المدى الطويل.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inspiration;