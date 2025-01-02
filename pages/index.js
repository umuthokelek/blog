import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaThLarge, FaList, FaArrowRight, FaComment, FaEye } from 'react-icons/fa';
import { Pacifico } from 'next/font/google';
import { getAllArticles, processMarkdown } from '../lib/articles';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

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

function getCommentCounts() {
  try {
    const commentsFile = path.join(process.cwd(), 'data/comments.json');
    const fileContents = fs.readFileSync(commentsFile, 'utf8');
    const { comments } = JSON.parse(fileContents);

    const counts = {};
    comments.forEach(comment => {
      counts[comment.articleId] = (counts[comment.articleId] || 0) + 1;
    });

    return counts;
  } catch (error) {
    console.error('Yorum sayıları getirilemedi:', error);
    return {};
  }
}

export async function getStaticProps() {
  const articles = getAllArticles();
  const commentCounts = getCommentCounts();

  return {
    props: {
      articles: articles.map(({ content, ...rest }) => rest),
      articlesContent: articles.reduce((acc, article) => {
        acc[article.id] = article.content;
        return acc;
      }, {}),
      commentCounts,
    },
  };
}

export default function Home({ articles, articlesContent, commentCounts }) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleContent, setArticleContent] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
    address: ''
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  useEffect(() => {
    async function loadArticleContent() {
      if (selectedArticle) {
        const article = articles.find(a => a.id === selectedArticle.id);
        if (article) {
          const content = articlesContent[article.id];
          const htmlContent = await processMarkdown(content);
          setArticleContent(htmlContent);
          setActiveTab('article');
        }
      }
    }
    loadArticleContent();
  }, [selectedArticle, articles, articlesContent]);

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="bg-transparent">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Son Makaleler</h1>
                <Link
                  href="/new-article"
                  className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors hover:scale-110 duration-200"
                  title="Yeni Makale Ekle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </Link>
              </div>
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
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {articles.map(article => (
                  <article 
                    key={article.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow p-3 sm:p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="relative aspect-[2/1] mb-3 sm:mb-4 cursor-pointer group">
                      <Link href={`/articles/${article.id}`}>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="rounded-lg object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw"
                        />
                      </Link>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-gray-100 line-clamp-2">
                        {article.title}
                      </h2>
                      <div className="space-y-1 mb-2 sm:mb-4">
                        <Link 
                          href={`/users/${article.authorId}`}
                          className="block text-xs sm:text-sm hover:text-primary-600 dark:hover:text-primary-400 font-medium truncate text-gray-500 dark:text-gray-400"
                        >
                          {article.author}
                        </Link>
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <FaEye size={12} className="flex-shrink-0" />
                            <span>{article.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaComment size={12} className="flex-shrink-0" />
                            <span>{commentCounts[article.id] || 0}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-base line-clamp-2 mb-2 sm:mb-4">
                        {article.summary}
                      </p>
                      <Link 
                        href={`/articles/${article.id}`}
                        className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 sm:gap-2"
                      >
                        Devamını Oku
                        <FaArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map(article => (
                  <article 
                    key={article.id}
                    className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="relative w-full md:w-48 aspect-[2/1] md:aspect-square flex-shrink-0">
                      <Link href={`/articles/${article.id}`}>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="rounded-lg object-cover"
                          sizes="(max-width: 768px) 100vw, 200px"
                        />
                      </Link>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100 line-clamp-2">
                        {article.title}
                      </h2>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <Link 
                          href={`/users/${article.authorId}`}
                          className="hover:text-primary-600 dark:hover:text-primary-400 font-medium truncate"
                        >
                          {article.author}
                        </Link>
                        <span className="hidden sm:inline">•</span>
                        <time dateTime={article.date} className="truncate">
                          {new Date(article.date).toLocaleDateString('tr-TR')}
                        </time>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <FaEye size={14} className="flex-shrink-0" />
                          <span>{article.views || 0}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <FaComment size={14} className="flex-shrink-0" />
                          <span>{commentCounts[article.id] || 0}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm sm:text-base">
                        {article.summary}
                      </p>
                      
                      <Link 
                        href={`/articles/${article.id}`}
                        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                      >
                        Devamını Oku
                        <FaArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        );

      case 'article':
        return selectedArticle ? (
          <div className="bg-transparent">
            <button 
              onClick={() => {
                setSelectedArticle(null);
                setArticleContent('');
                setActiveTab('home');
              }}
              className="mb-8 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium flex items-center"
            >
              ← Geri Dön
            </button>
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="relative aspect-[2/1] mb-6">
                <Image
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  fill
                  className="rounded-xl object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {selectedArticle.title}
              </h1>
              <div className="mb-6 flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <span>{selectedArticle.author}</span>
                <span>•</span>
                <span>{new Date(selectedArticle.date).toLocaleDateString('tr-TR')}</span>
              </div>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: articleContent }}
              />
            </article>
          </div>
        ) : null;

      case 'register':
        return (
          <div className="bg-transparent">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Kayıt Formu</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">Ad:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Soyad:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-700 dark:text-gray-300">E-posta:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-700 dark:text-gray-300">Şifre:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Şifre Tekrar:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">Telefon:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="text-gray-700 dark:text-gray-300">Doğum Tarihi:</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="text-gray-700 dark:text-gray-300">Cinsiyet:</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">Seçiniz</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-gray-700 dark:text-gray-300">Adres:</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <button type="submit" className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                Kayıt Ol
              </button>
            </form>
          </div>
        );

      case 'about':
        return (
          <div className="bg-transparent">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Hakkımızda</h1>
            <p className="text-gray-800 dark:text-gray-300">Şirketimiz 2010 yılından bu yana teknoloji sektöründe hizmet vermektedir...</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">1M+</h3>
                <p className="text-gray-700 dark:text-gray-300">Kullanıcı</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">50+</h3>
                <p className="text-gray-700 dark:text-gray-300">Ülke</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">24/7</h3>
                <p className="text-gray-700 dark:text-gray-300">Destek</p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="bg-transparent">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">İletişim</h1>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Adres</h3>
                <p className="text-gray-700 dark:text-gray-300">İstanbul, Türkiye</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">E-posta</h3>
                <p className="text-gray-700 dark:text-gray-300">info@example.com</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Telefon</h3>
                <p className="text-gray-700 dark:text-gray-300">+90 555 555 55 55</p>
              </div>
            </div>
          </div>
        );
    }
  };

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
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/10 dark:to-transparent"></div>

        <div className="relative mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <h2 
              onClick={() => {
                setSelectedArticle(null);
                setArticleContent('');
                setActiveTab('home');
              }}
              className={`${pacifico.className} text-gray-900 dark:text-white text-6xl hover:scale-105 transition-transform duration-300 cursor-pointer`}
            >
              Umut Hökelek
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mt-1">
              Software Engineer
            </p>
          </div>
        </div>
      </div>

      <nav className="bg-white dark:bg-gray-800 shadow-lg mb-8 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              >
                <span className="sr-only">Menüyü aç</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            <ul className="hidden md:flex items-center gap-4">
              {['home', 'register', 'about', 'contact'].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-4 rounded-lg transition-colors ${
                      activeTab === tab
                        ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-300 font-medium'
                        : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={toggleDarkMode}
              className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={isDarkMode ? 'Açık Tema' : 'Koyu Tema'}
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['home', 'register', 'about', 'contact'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === tab
                      ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-300'
                      : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <main className="flex-1 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            {renderContent()}
          </div>
        </main>

        <aside className="w-72 hidden xl:block shrink-0">
          <div className="sticky top-28 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Popüler Makaleler
            </h3>
            <div className="space-y-4">
              {articles.slice(0, 5).map((article) => (
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
                <Link 
                  href="#"
                  className="block px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Yapay Zeka
                </Link>
                <Link 
                  href="#"
                  className="block px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Web Geliştirme
                </Link>
                <Link 
                  href="#"
                  className="block px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Mobil Uygulama
                </Link>
                <Link 
                  href="#"
                  className="block px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Siber Güvenlik
                </Link>
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
