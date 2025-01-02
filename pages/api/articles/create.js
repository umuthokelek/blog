import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, summary, image, content } = req.body;

    // Default kapak fotoğrafı
    const defaultCover = "https://picsum.photos/seed/default/800/400";

    // Başlıktan URL-friendly bir slug oluştur
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9ğüşıöç]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Yeni makale için meta verileri oluştur
    const frontmatter = {
      id: Date.now(), // Benzersiz bir ID
      title,
      summary,
      image: image || defaultCover, // Eğer image boşsa default kapağı kullan
      date: new Date().toISOString().split('T')[0],
      author: "Umut Hökelek", // Şimdilik sabit
      authorId: 1, // Şimdilik sabit
    };

    // Markdown içeriğini oluştur
    const markdown = matter.stringify(content, frontmatter);

    // Dosya yolunu oluştur
    const filePath = path.join(process.cwd(), 'content/articles', `${slug}.md`);

    // Dosyayı kaydet
    fs.writeFileSync(filePath, markdown);

    res.status(200).json({ 
      success: true, 
      id: frontmatter.id,
      message: 'Makale başarıyla oluşturuldu' 
    });
  } catch (error) {
    console.error('Makale oluşturma hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Makale oluşturulurken bir hata oluştu' 
    });
  }
} 