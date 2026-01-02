
/**
 * Processa uma URL de imagem.
 * Converte links de serviços de armazenamento (Drive, Dropbox) para links diretos de imagem.
 * Mantém URLs de outros provedores (Cloud, S3, etc) intactas.
 */
export const processGoogleDriveLink = (url: string): string => {
  if (!url) return '';
  
  let cleanUrl = url.trim();
  
  // Se não for link http/https, retorna vazio para evitar erros
  if (!cleanUrl.startsWith('http')) {
      return ''; 
  }

  // Dropbox: Converte link de visualização para link direto (?raw=1)
  if (cleanUrl.includes('dropbox.com')) {
      if (cleanUrl.includes('?dl=0')) cleanUrl = cleanUrl.replace('?dl=0', '');
      if (cleanUrl.includes('&dl=0')) cleanUrl = cleanUrl.replace('&dl=0', '');
      
      if (!cleanUrl.includes('raw=1')) {
          const separator = cleanUrl.includes('?') ? '&' : '?';
          return `${cleanUrl}${separator}raw=1`;
      }
  }

  // Google Drive
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
      let id = '';
      // Tenta encontrar o ID no formato /d/ID/
      const parts = cleanUrl.match(/\/d\/([^/?#]+)/);
      if (parts && parts[1]) {
          id = parts[1];
      } else {
          // Tenta encontrar o ID no formato id=ID
          const idMatch = cleanUrl.match(/[?&]id=([^&]+)/);
          if (idMatch && idMatch[1]) {
              id = idMatch[1];
          }
      }

      if (id) {
          // MUDANÇA CRÍTICA: Usar endpoint 'thumbnail' com size large (w1000).
          // O endpoint 'lh3' ou 'uc' costuma dar erro 403 no Vercel.
          // O endpoint 'thumbnail' é mais permissivo para arquivos públicos.
          return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      }
  }
  
  return cleanUrl;
};
