import { Quote } from './types';

export async function shareQuote(quote: Quote, pdfBlob?: Blob) {
  const text = `
*ArClean - Orçamento ${quote.osNumber}*

Cliente: ${quote.client.name}
Data: ${new Date(quote.date).toLocaleDateString('pt-BR')}

${quote.items.length} serviço(s)
Total: R$ ${quote.total.toFixed(2)}

${quote.observations ? `Obs: ${quote.observations}` : ''}
  `.trim();

  // Check if Web Share API is available and supports files
  if (navigator.share && pdfBlob) {
    try {
      const file = new File([pdfBlob], `Orcamento-${quote.osNumber}.pdf`, {
        type: 'application/pdf',
      });

      await navigator.share({
        title: `Orçamento ${quote.osNumber} - ArClean`,
        text: text,
        files: [file],
      });

      return true;
    } catch (error) {
      console.log('Web Share failed, falling back to WhatsApp:', error);
    }
  }

  // Fallback to WhatsApp link
  const whatsappText = encodeURIComponent(text);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;
  window.open(whatsappUrl, '_blank');
  
  return false;
}

export function shareViaWhatsApp(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
  window.open(url, '_blank');
}
