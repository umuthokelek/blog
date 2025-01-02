function Error({ statusCode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {statusCode
            ? `${statusCode} - Sunucu Hatası`
            : 'Bir Hata Oluştu'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {statusCode
            ? 'Sunucuda bir hata oluştu.'
            : 'İstemcide bir hata oluştu.'}
        </p>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 