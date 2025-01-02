import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { articleId } = req.query;

    // comments.json dosyasını oku
    const commentsFile = path.join(process.cwd(), 'data/comments.json');
    const fileContents = fs.readFileSync(commentsFile, 'utf8');
    const comments = JSON.parse(fileContents);

    // Makaleye ait yorumları filtrele
    const articleComments = comments.comments
      .filter(comment => comment.articleId === parseInt(articleId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      comments: articleComments
    });
  } catch (error) {
    console.error('Yorum getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yorumlar getirilirken bir hata oluştu'
    });
  }
} 