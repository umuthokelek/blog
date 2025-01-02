import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaThLarge, FaList } from 'react-icons/fa';
import { getAllArticles } from '../../lib/articles';
import { getUser } from '../../lib/users';
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({ 
  subsets: ['latin'],
  weight: ['400'],
});

const socialLinks = [
  { icon: <FaFacebookF size={18} />, name: 'Facebook', href: '#' },
  { icon: <FaTwitter size={18} />, name: 'Twitter', href: '#' },
  { icon: <FaInstagram size={18} />, name: 'Instagram', href: '#' },
  { icon: <FaLinkedinIn size={18} />, name: 'LinkedIn', href: '#' },
];

export async function getStaticPaths() {
  const users = await getUser();
  const paths = users.map((user) => ({
    params: { id: user.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const user = await getUser(params.id);
  const allArticles = getAllArticles();
  const userArticles = allArticles.filter(article => article.authorId === parseInt(params.id));

  return {
    props: {
      user,
      articles: userArticles,
      recentArticles: allArticles.slice(0, 5),
    },
  };
}

export default function UserProfile({ user, articles, recentArticles }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e520,#4f46e510,transparent_50%)] backdrop-blur-[1px]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-20"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-16">
          <div className="text-center">
            <Link href="/">
              <h2 className={`${pacifico.className} bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 text-7xl animate-fade-in hover:scale-105 transition-transform duration-300 cursor-pointer`}>
                Umut Hökelek
              </h2>
            </Link>
            <p className="text-lg text-primary-100 font-medium animate-fade-in-up mt-2">
              Bilgisayar Mühendisi
            </p>
            
            <div className="absolute top-6 right-6 flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-110 hover:shadow-lg hover:shadow-white/10"
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <div className="relative h-24">
            <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            </div>
            <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-20"></div>
          </div>
        </div>
      </div>

      <nav className="bg-white dark:bg-gray-800 shadow-lg mb-8 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <ul className="flex flex-wrap justify-center space-x-8 py-4">
            {['home', 'register', 'about', 'contact'].map((tab) => (
              <li key={tab}>
                <Link
                  href={tab === 'home' ? '/' : `/#${tab}`}
                  className="px-4 py-2 rounded-lg transition-colors text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <main className="flex-1 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <Link 
              href="/"
              className="mb-8 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium flex items-center"
            >
              ← Ana Sayfaya Dön
            </Link>

            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover ring-4 ring-white/10 dark:ring-gray-700/50"
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {user.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {user.bio}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {user.socialLinks?.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Yazarın Makaleleri
              </h2>
              <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                  aria-label="Grid view"
                >
                  <FaThLarge size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                  aria-label="List view"
                >
                  <FaList size={16} />
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(article => (
                  <article 
                    key={article.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative aspect-[2/1] mb-4">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <Link href={`/articles/${article.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 mb-2">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {article.summary}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article.date).toLocaleDateString('tr-TR')}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map(article => (
                  <article 
                    key={article.id}
                    className="flex gap-6 bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative w-48 shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={192}
                        height={108}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/articles/${article.id}`}>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 mb-2">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {article.summary}
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(article.date).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>

        <aside className="w-72 hidden xl:block shrink-0">
          <div className="sticky top-28 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Son Makaleler
            </h3>
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <Link 
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="relative w-20 h-20 shrink-0">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(article.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Kategoriler
              </h3>
              <div className="space-y-2">
                {/* ... kategoriler aynı ... */}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="bg-gray-800 dark:bg-gray-900 text-white mt-16 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">İletişim</h3>
            <div className="space-y-2 text-gray-300">
              <p>Email: info@example.com</p>
              <p>Tel: +90 555 555 55 55</p>
              <p>Adres: İstanbul, Türkiye</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400">Gizlilik Politikası</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400">Kullanım Şartları</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400">SSS</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Bizi Takip Edin</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-primary-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-600/20"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
} 