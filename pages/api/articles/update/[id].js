import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllArticles } from '../../../../lib/articles';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { title, summary, image, content } = req.body;

    console.log('Güncelleme isteği:', { id, title, summary });

    const articles = getAllArticles();
    const article = articles.find(a => a.id === parseInt(id));

    if (!article) {
      console.error('Makale bulunamadı:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'Makale bulunamadı' 
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'İçerik boş olamaz'
      });
    }

    console.log('Mevcut makale:', article);

    // Yeni frontmatter oluştur
    const frontmatter = {
      id: article.id,
      title,
      summary,
      image: image || article.image,
      date: article.date,
      author: article.author,
      authorId: article.authorId,
      slug: article.slug
    };

    console.log('Yeni frontmatter:', frontmatter);

    if (!frontmatter.title || !frontmatter.summary) {
      return res.status(400).json({
        success: false,
        message: 'Başlık ve özet alanları zorunludur'
      });
    }

    // Markdown içeriğini oluştur
    let markdown;
    try {
      markdown = matter.stringify(content, frontmatter);
    } catch (matterError) {
      console.error('Markdown oluşturma hatası:', matterError);
      return res.status(500).json({
        success: false,
        message: 'Markdown oluşturulurken bir hata oluştu'
      });
    }

    // Dosya yolunu oluştur
    const filePath = path.join(process.cwd(), 'content/articles', `${frontmatter.slug}.md`);

    console.log('Dosya yolu:', filePath);
    console.log('Dosya var mı:', fs.existsSync(filePath));

    // Dosyayı güncelle
    try {
      fs.writeFileSync(filePath, markdown);
      console.log('Dosya başarıyla güncellendi');
    } catch (writeError) {
      console.error('Dosya yazma hatası:', writeError);
      throw writeError;
    }

    res.status(200).json({ 
      success: true, 
      message: 'Makale başarıyla güncellendi' 
    });
  } catch (error) {
    console.error('Makale güncelleme hatası:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      success: false, 
      message: `Makale güncellenirken bir hata oluştu: ${error.message}`,
      error: error.code || 'UNKNOWN_ERROR'
    });
  }
} 