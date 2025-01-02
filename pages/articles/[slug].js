import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEdit, FaTrash, FaReply } from 'react-icons/fa';
import { getAllArticles, processMarkdown } from '../../lib/articles';
import { Pacifico } from 'next/font/google';
import { useRouter } from 'next/router';

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
  const articles = getAllArticles();
  const paths = articles.map((article) => ({
    params: { 
      slug: article.id.toString()
    },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const articles = getAllArticles();
  const article = articles.find((article) => article.id.toString() === params.slug);
  const contentHtml = await processMarkdown(article.content);

  return {
    props: {
      article: {
        ...article,
        contentHtml,
      },
      articles,
    },
  };
}

// Yorumları hiyerarşik yapıya dönüştür
const buildCommentTree = (comments) => {
  const commentMap = {};
  const rootComments = [];

  // Önce tüm yorumları bir map'e ekle
  comments.forEach(comment => {
    commentMap[comment.id] = {
      ...comment,
      replies: []
    };
  });

  // Yanıtları ilgili yorumların altına ekle
  comments.forEach(comment => {
    if (comment.replyTo === null) {
      rootComments.push(commentMap[comment.id]);
    } else {
      commentMap[comment.replyTo].replies.push(commentMap[comment.id]);
    }
  });

  return rootComments;
};

// Tekil yorum bileşeni
const Comment = ({ comment, onReply, onDelete, comments, level = 0 }) => {
  return (
    <div className={`${level > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {comment.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(comment.date).toLocaleDateString('tr-TR')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onReply(comment)}
              className="p-2 rounded-lg text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              title="Yanıtla"
            >
              <FaReply size={16} />
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="p-2 rounded-lg text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Sil"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          {comment.content}
        </p>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4 border-l-2 border-gray-200 dark:border-gray-700">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              comments={comments}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Article({ article, articles }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: '',
    replyTo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

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

  const handleDelete = async () => {
    if (!window.confirm('Bu makaleyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/articles/delete/${article.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = '/';
      } else {
        alert(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Makale silme hatası:', error);
      alert('Makale silinirken bir hata oluştu');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [article.id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${article.id}`);
      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Yorumlar getirilemedi:', error);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setNewComment(prev => ({
      ...prev,
      replyTo: comment.id,
      content: ''
    }));
    // Form alanına scroll
    document.getElementById('commentForm').scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment(prev => ({
      ...prev,
      replyTo: null,
      content: ''
    }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newComment,
          articleId: article.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewComment({ name: '', email: '', content: '', replyTo: null });
        setReplyingTo(null);
        fetchComments();
      } else {
        alert(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Yorum gönderme hatası:', error);
      alert('Yorum gönderilirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/delete/${commentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchComments(); // Yorumları yenile
      } else {
        alert(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Yorum silme hatası:', error);
      alert('Yorum silinirken bir hata oluştu');
    }
  };

  // Yorumları ağaç yapısına dönüştür
  const commentTree = buildCommentTree(comments);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/10 dark:to-transparent"></div>

        <div className="relative mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <h2 
              onClick={() => router.push('/')}
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

      <div className="relative max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <main className="flex-1 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <Link 
              href="/"
              className="mb-8 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium flex items-center"
            >
              ← Ana Sayfaya Dön
            </Link>
            <article>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {article.title}
                </h1>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/articles/edit/${article.id}`}
                    className="p-2 rounded-lg text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Düzenle"
                  >
                    <FaEdit size={20} />
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 rounded-lg text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    title="Sil"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>

              <div className="relative aspect-[2/1] mb-8">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="rounded-xl object-cover"
                />
              </div>

              <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 mb-8">
                <Link 
                  href={`/users/${article.authorId}`}
                  className="text-sm hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {article.author}
                </Link>
                <span className="text-sm">•</span>
                <span className="text-sm">
                  {new Date(article.date).toLocaleDateString('tr-TR')}
                </span>
              </div>

              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
              />

              <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                  Yorumlar ({comments.length})
                </h2>

                <div className="space-y-6 mb-8">
                  {commentTree.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      onReply={handleReply}
                      onDelete={handleDeleteComment}
                      comments={comments}
                    />
                  ))}
                </div>

                <form id="commentForm" onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
                  {replyingTo && (
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{replyingTo.name}</span> kullanıcısına yanıt yazıyorsunuz
                      </p>
                      <button
                        type="button"
                        onClick={cancelReply}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                      >
                        İptal
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        İsim
                      </label>
                      <input
                        type="text"
                        value={newComment.name}
                        onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={newComment.email}
                        onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Yorum
                    </label>
                    <textarea
                      value={newComment.content}
                      onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Gönderiliyor...' : 'Yorum Yap'}
                    </button>
                  </div>
                </form>
              </div>
            </article>
          </div>
        </main>

        <aside className="w-72 hidden xl:block shrink-0">
          <div className="sticky top-28 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Popüler Makaleler
            </h3>
            <div className="space-y-4">
              {articles.slice(0, 5).map((a) => (
                <Link 
                  key={a.id}
                  href={`/articles/${a.id}`}
                  className={`flex items-start gap-3 group ${a.id === article.id ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <div className="relative w-20 h-20 shrink-0">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
                      {a.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(a.date).toLocaleDateString('tr-TR')}
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