import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaImage, FaTimes, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Inter, Pacifico } from 'next/font/google';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });
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

const MarkdownEditor = ({ value, onChange }) => {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent font-mono min-h-[400px]"
        placeholder="Markdown formatında içeriğinizi yazın..."
      />
      <div className="prose dark:prose-invert mt-4">
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    </div>
  );
};

export default function NewArticle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    image: '',
    content: '',
  });
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Dark mode kontrolü
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/articles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Başarılı olduğunda makale sayfasına yönlendir
        window.location.href = `/articles/${data.id}`;
      } else {
        // Hata durumunda kullanıcıya bilgi ver
        alert(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Makale oluşturma hatası:', error);
      alert('Makale oluşturulurken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
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
                router.push('/');
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
                  <Link
                    href={tab === 'home' ? '/' : `/#${tab}`}
                    className="px-5 py-4 rounded-lg transition-colors text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Link>
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
                <Link
                  key={tab}
                  href={tab === 'home' ? '/' : `/#${tab}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Yeni Makale Oluştur
            </h1>
            <Link
              href="/"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes size={20} />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="Makalenin başlığını girin..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Özet
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="Makalenin kısa bir özetini yazın..."
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kapak Görseli URL
              </label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FaImage className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İçerik
              </label>
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href="/"
                className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                İptal
              </Link>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Yayınlanıyor...' : 'Yayınla'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
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