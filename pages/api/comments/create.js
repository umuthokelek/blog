import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { articleId, name, email, content } = req.body;

    // Yorum verilerini kontrol et
    if (!articleId || !name || !email || !content) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar zorunludur'
      });
    }

    // comments.json dosyasını oku
    const commentsFile = path.join(process.cwd(), 'data/comments.json');
    const fileContents = fs.readFileSync(commentsFile, 'utf8');
    const comments = JSON.parse(fileContents);

    // Yeni yorumu ekle
    const newComment = {
      id: Date.now(),
      articleId: parseInt(articleId),
      name,
      email,
      content,
      date: new Date().toISOString(),
      replyTo: req.body.replyTo || null
    };

    comments.comments.push(newComment);

    // Dosyayı güncelle
    fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));

    res.status(200).json({
      success: true,
      comment: newComment,
      message: 'Yorum başarıyla eklendi'
    });
  } catch (error) {
    console.error('Yorum ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yorum eklenirken bir hata oluştu'
    });
  }
} 