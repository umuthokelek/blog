import fs from 'fs';
import path from 'path';
import { getAllArticles } from '../../../../lib/articles';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    console.log('Silinecek makale ID:', id);

    const articles = getAllArticles();
    const article = articles.find(a => a.id === parseInt(id));

    if (!article) {
      console.error('Makale bulunamadı:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'Makale bulunamadı' 
      });
    }

    console.log('Silinecek makale:', article);

    // Dosya yolunu oluştur
    const filePath = path.join(process.cwd(), 'content/articles', `${article.slug}.md`);

    console.log('Dosya yolu:', filePath);
    console.log('Dosya var mı:', fs.existsSync(filePath));

    // Dosyayı sil
    try {
      fs.unlinkSync(filePath);
      console.log('Dosya başarıyla silindi');
    } catch (unlinkError) {
      console.error('Dosya silme hatası:', unlinkError);
      throw unlinkError;
    }

    res.status(200).json({ 
      success: true, 
      message: 'Makale başarıyla silindi' 
    });
  } catch (error) {
    console.error('Makale silme hatası:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      success: false, 
      message: `Makale silinirken bir hata oluştu: ${error.message}`,
      error: error.code || 'UNKNOWN_ERROR'
    });
  }
} 