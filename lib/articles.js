import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

// Bu fonksiyon sadece build zamanında çalışacak
export function getAllArticles() {
  try {
    // Klasör var mı kontrol et
    if (!fs.existsSync(articlesDirectory)) {
      console.warn('Articles directory does not exist:', articlesDirectory);
      return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    console.log('Bulunan dosyalar:', fileNames);

    const articles = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const filePath = path.join(articlesDirectory, fileName);
        console.log('Dosya okunuyor:', filePath);

        try {
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContents);
          
          // Dosya adından slug oluştur (örn: makale-basligi.md -> makale-basligi)
          const slug = fileName.replace(/\.md$/, '');
          
          return {
            ...data,
            slug, // Eğer frontmatter'da slug yoksa dosya adını kullan
            content
          };
        } catch (error) {
          console.error('Dosya okuma hatası:', {
            file: fileName,
            error: error.message
          });
          return null;
        }
      })
      .filter(Boolean); // Hatalı okunanları filtrele

    // Tarihe göre sırala
    return articles.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

// Bu fonksiyon client tarafında çalışacak
export async function processMarkdown(content) {
  try {
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkHtml)
      .process(content);
    return processedContent.toString();
  } catch (error) {
    console.error('Error processing markdown:', error);
    return '';
  }
} 