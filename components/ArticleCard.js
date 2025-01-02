import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '../utils/date';

export default function ArticleCard({ article }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative aspect-[16/9]">
        <Image
          src={article.image || 'https://picsum.photos/800/600'}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 94vw, (max-width: 1024px) 45vw, 30vw"
          priority
        />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
          {article.summary}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(article.date)}
          </span>
          <Link
            href={`/articles/${article.id}`}
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Devamını Oku →
          </Link>
        </div>
      </div>
    </div>
  );
} 