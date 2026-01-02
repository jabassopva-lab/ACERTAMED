import { Sign, SignCategory } from '../types';
import { processGoogleDriveLink } from '../utils';

interface CatalogOptions {
  storeName: string;
  logoUrl: string;
  whatsappNumber: string;
}

const getSignCode = (sign: Sign) => sign.code || `REF-${sign.id.toString().slice(-4)}`;

export const generateCatalogPDF = (signs: Sign[], options: CatalogOptions) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const ITEMS_PER_PAGE = 15; 

  const groupedSigns: Record<string, Sign[]> = {};
  signs
    .filter(s => !s.isHidden && s.category !== SignCategory.Custom && s.category !== 'Placas Editável')
    .forEach(sign => {
      if (!groupedSigns[sign.category]) {
        groupedSigns[sign.category] = [];
      }
      groupedSigns[sign.category].push(sign);
    });

  const categoriesOrder = [
    SignCategory.Warning,      // 2 AVISO
    SignCategory.Attention,    // 3 ATENÇÃO
    SignCategory.Security,     // 4 SEGURANÇA
    SignCategory.Info,         // 5 INFORMATIVAS
    SignCategory.Danger,       // 6 PERIGO
    SignCategory.Prohibition,  // 7 PROIBIÇÃO
    SignCategory.Emergency,    // 8 EMERGENCIA
    SignCategory.Fire,         // 9 COMBATE A INCENDIO
    SignCategory.Traffic,      // 10 TRANSITO
    SignCategory.Mandatory     // Extras
  ];

  const sortedCategories = Object.keys(groupedSigns).sort((a, b) => {
    const indexA = categoriesOrder.indexOf(a as SignCategory);
    const indexB = categoriesOrder.indexOf(b as SignCategory);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  let pagesHtml = '';
  
  pagesHtml += `
    <div class="page cover">
        <div class="cover-logo">
            <img src="${options.logoUrl}" alt="Logo">
        </div>
        <h1>CATÁLOGO TÉCNICO DE SINALIZAÇÃO</h1>
        <h2>Segurança do Trabalho & Comunicação Visual</h2>
        <div class="compliance">
            <strong>CONFORMIDADE NORMATIVA NR 26 / ISO 7010</strong><br><br>
            Este catálogo apresenta soluções de sinalização técnica que seguem rigorosamente os padrões de 
            cores, formas e símbolos exigidos pela legislação vigente.
        </div>
        <div style="margin-top: 80px; font-weight: bold; font-size: 14px;">
            Edição ${new Date().getFullYear()}
        </div>
    </div>
  `;

  sortedCategories.forEach((category) => {
    const items = groupedSigns[category];
    const totalPagesForCategory = Math.ceil(items.length / ITEMS_PER_PAGE);

    for (let i = 0; i < totalPagesForCategory; i++) {
      const start = i * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageItems = items.slice(start, end);
      const isFirstPageOfCategory = i === 0;

      pagesHtml += `
        <div class="page">
            <div class="header">
                <img src="${options.logoUrl}" alt="Logo">
                <div class="header-info" style="text-align: right">
                    <div class="title">${options.storeName}</div>
                    <div style="font-size: 9px; color: #64748b">Catálogo de Sinalização</div>
                </div>
            </div>

            <div class="category-section">
                ${isFirstPageOfCategory ? `<div class="category-title">${category}</div>` : `<div class="category-title-cont">${category} (cont.)</div>`}
                <div class="grid">
                    ${pageItems.map(sign => `
                        <div class="item">
                            <div class="item-img-container">
                                <img src="${processGoogleDriveLink(sign.imageUrl)}" alt="${sign.title}">
                            </div>
                            <div class="item-info">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 4px;">
                                    <h4>${sign.title}</h4>
                                    <span class="sign-code">${getSignCode(sign)}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="footer">
                <span>${options.storeName}</span>
                <span>Página {PAGE_NUM}</span>
            </div>
        </div>
      `;
    }
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Catálogo - ${options.storeName}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; color: #1e293b; background: #f1f5f9; }
            .page { width: 210mm; height: 296mm; padding: 10mm 12mm; margin: 5mm auto; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative; box-sizing: border-box; overflow: hidden; page-break-after: always; }
            .page:last-of-type { page-break-after: auto !important; }
            .cover { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: linear-gradient(135deg, #1D4E89 0%, #009BA5 100%); color: white; padding: 20mm; }
            .cover-logo { background: white; padding: 20px; border-radius: 12px; margin-bottom: 30px; max-width: 280px; }
            .cover-logo img { max-width: 100%; height: auto; }
            .cover h1 { font-size: 36px; font-weight: 900; margin: 0; line-height: 1; }
            .cover h2 { font-size: 16px; font-weight: 400; opacity: 0.8; margin-top: 15px; text-transform: uppercase; letter-spacing: 2px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 10px; }
            .header img { height: 28px; }
            .header .title { font-size: 10px; font-weight: 900; color: #1D4E89; text-transform: uppercase; }
            .category-title { background: #f8fafc; padding: 5px 10px; border-left: 4px solid #009BA5; font-size: 12px; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; color: #334155; }
            .category-title-cont { font-size: 9px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; color: #94a3b8; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
            .item { border: 1px solid #f1f5f9; padding: 6px; border-radius: 6px; display: flex; flex-direction: column; background: #fff; }
            .item-img-container { height: 38mm; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; border-radius: 4px; overflow: hidden; border: 1px solid #f1f5f9; }
            .item-img-container img { max-width: 95%; max-height: 95%; object-fit: contain; }
            .item-info h4 { margin: 0; font-size: 8px; font-weight: 900; text-transform: uppercase; color: #1e293b; line-height: 1.1; flex: 1; }
            .sign-code { font-size: 7px; font-weight: 900; background: #f1f5f9; padding: 1px 3px; border-radius: 2px; color: #475569; white-space: nowrap; }
            .footer { position: absolute; bottom: 8mm; left: 12mm; right: 12mm; border-top: 1px solid #f1f5f9; padding-top: 5px; display: flex; justify-content: space-between; font-size: 7px; color: #cbd5e1; font-weight: bold; text-transform: uppercase; }
            @media print { body { background: white; -webkit-print-color-adjust: exact; } .page { margin: 0; box-shadow: none; width: 210mm; height: 297mm; } .no-print { display: none; } }
        </style>
    </head>
    <body>
        ${pagesHtml}
        <script>
            window.onload = function() {
                const pages = document.querySelectorAll('.page');
                pages.forEach((p, i) => { p.innerHTML = p.innerHTML.replace('{PAGE_NUM}', (i + 1)); });
                setTimeout(() => { window.print(); }, 1200);
            }
        </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};