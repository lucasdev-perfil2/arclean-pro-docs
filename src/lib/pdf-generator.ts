import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Quote, Company } from './types';

export async function generatePDF(quote: Quote, company: Company): Promise<Blob> {
  // Get the preview element
  const element = document.getElementById('pdf-preview-content');
  if (!element) {
    throw new Error('Preview element not found');
  }

  // Store original width for responsive elements
  const originalWidth = element.style.width;
  element.style.width = '794px'; // A4 width in pixels at 96 DPI
  
  // Create canvas from HTML
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    width: 794,
    windowWidth: 794,
  });
  
  // Restore original width
  element.style.width = originalWidth;

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  
  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Add additional pages if needed
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  return pdf.output('blob');
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
