export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          500 - Sunucu Hatası
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </p>
      </div>
    </div>
  );
} 