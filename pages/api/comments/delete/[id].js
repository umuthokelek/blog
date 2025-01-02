import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    // comments.json dosyasını oku
    const commentsFile = path.join(process.cwd(), 'data/comments.json');
    const fileContents = fs.readFileSync(commentsFile, 'utf8');
    const comments = JSON.parse(fileContents);

    // Yorumu ve tüm yanıtlarını bul
    const commentToDelete = comments.comments.find(c => c.id === parseInt(id));
    if (!commentToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }

    // Yorumu ve tüm yanıtlarını sil
    const removeCommentAndReplies = (commentId) => {
      comments.comments = comments.comments.filter(c => {
        if (c.id === commentId || c.replyTo === commentId) {
          // Alt yorumları da recursive olarak sil
          if (c.id !== commentId) {
            removeCommentAndReplies(c.id);
          }
          return false;
        }
        return true;
      });
    };

    removeCommentAndReplies(parseInt(id));

    // Dosyayı güncelle
    fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));

    res.status(200).json({
      success: true,
      message: 'Yorum başarıyla silindi'
    });
  } catch (error) {
    console.error('Yorum silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yorum silinirken bir hata oluştu'
    });
  }
} 