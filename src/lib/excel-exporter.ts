import * as XLSX from 'xlsx';
import { Quote, Company } from './types';

export function exportToExcel(quote: Quote, company: Company) {
  // Prepare data
  const worksheetData = [
    ['ORÇAMENTO / ORDEM DE SERVIÇO'],
    [''],
    ['Empresa:', company.name],
    ['Proprietário:', company.owner],
    ['Telefone:', company.phone],
    ['Email:', company.email],
    ['Endereço:', company.address],
    [''],
    ['Nº OS:', quote.osNumber],
    ['Data:', new Date(quote.date).toLocaleDateString('pt-BR')],
    [''],
    ['CLIENTE'],
    ['Nome:', quote.client.name],
    ['Telefone:', quote.client.phone],
    ['Documento:', quote.client.document],
    ['Endereço:', quote.client.address],
    [''],
    ['SERVIÇOS'],
    ['Serviço', 'Categoria', 'Qtd', 'Unidade', 'Unitário', 'Subtotal'],
  ];

  // Add items
  quote.items.forEach(item => {
    worksheetData.push([
      item.serviceName,
      item.category,
      item.qty.toString(),
      item.unit,
      `R$ ${item.unitPrice.toFixed(2)}`,
      `R$ ${item.subtotal.toFixed(2)}`,
    ]);
  });

  // Add totals
  worksheetData.push(
    [''],
    ['', '', '', '', 'Subtotal:', `R$ ${quote.subtotal.toFixed(2)}`],
    ['', '', '', '', 'Desconto:', `R$ ${(quote.discountType === 'percent' ? (quote.subtotal * quote.discount / 100) : quote.discount).toFixed(2)}`],
    ['', '', '', '', 'Impostos:', `R$ ${quote.taxes.toFixed(2)}`],
    ['', '', '', '', 'Taxa Deslocamento:', `R$ ${quote.travelFee.toFixed(2)}`],
    ['', '', '', '', 'TOTAL:', `R$ ${quote.total.toFixed(2)}`],
    [''],
    ['Observações:', quote.observations],
    ['Validade:', `${quote.validity} dias`],
  );

  // Create workbook and worksheet
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orçamento');

  // Set column widths
  ws['!cols'] = [
    { wch: 40 },
    { wch: 20 },
    { wch: 8 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
  ];

  // Generate file
  const filename = `Orcamento-ArClean-${quote.osNumber}.xlsx`;
  XLSX.writeFile(wb, filename);
}
