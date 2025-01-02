export function formatDate(date) {
  // Önce tarihi ISO string'e çevirip sonra yeni bir Date objesi oluşturuyoruz
  const isoDate = new Date(date).toISOString();
  const dateObj = new Date(isoDate);
  
  // Tarihi manuel olarak formatlayalım
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  // Türkçe format: GG.AA.YYYY
  return `${day}.${month}.${year}`;
} 