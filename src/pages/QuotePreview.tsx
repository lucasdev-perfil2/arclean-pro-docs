import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Printer } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate } from '@/lib/utils-format';
import { generatePDF, downloadPDF } from '@/lib/pdf-generator';
import { shareQuote } from '@/lib/share-utils';
import type { Quote } from '@/lib/types';

export default function QuotePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quotes, company } = useData();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      const foundQuote = quotes.find(q => q.id === id);
      if (foundQuote) {
        setQuote(foundQuote);
      } else {
        navigate('/history');
      }
    }
  }, [id, quotes, navigate]);

  const handleDownloadPDF = async () => {
    if (!quote) return;
    
    setIsGenerating(true);
    try {
      const blob = await generatePDF(quote, company);
      downloadPDF(blob, `Orcamento-${quote.osNumber}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!quote) return;
    
    try {
      const blob = await generatePDF(quote, company);
      await shareQuote(quote, blob);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!quote) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando orçamento...</p>
        </div>
      </Layout>
    );
  }

  const discountAmount = quote.discountType === 'percent'
    ? quote.subtotal * (quote.discount / 100)
    : quote.discount;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Action Bar - Hidden on print */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 print:hidden">
          <Link to="/history" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleShare} className="w-full sm:w-auto">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button onClick={handleDownloadPDF} disabled={isGenerating} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Baixar PDF'}
            </Button>
          </div>
        </div>

        {/* PDF Preview Content */}
        <div
          id="pdf-preview-content"
          className="bg-white text-black p-4 sm:p-6 md:p-8 lg:p-12 rounded-lg shadow-lg max-w-4xl mx-auto print:shadow-none print:max-w-none print:p-8"
        >
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-4 sm:pb-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="w-full sm:w-auto">
                {company.logoDataUrl && (
                  <img
                    src={company.logoDataUrl}
                    alt={company.name}
                    className="h-12 sm:h-16 mb-2 sm:mb-3 object-contain"
                  />
                )}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-sm sm:text-base text-gray-700 font-medium">{company.owner}</p>
                {company.phone && <p className="text-xs sm:text-sm text-gray-600">{company.phone}</p>}
                {company.email && <p className="text-xs sm:text-sm text-gray-600">{company.email}</p>}
                {company.address && <p className="text-xs sm:text-sm text-gray-600">{company.address}</p>}
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  ORÇAMENTO / ORDEM DE SERVIÇO
                </h2>
                <p className="text-lg sm:text-xl font-semibold text-gray-700">{quote.osNumber}</p>
                <p className="text-sm sm:text-base text-gray-600">Data: {formatDate(quote.date)}</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Dados do Cliente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Nome:</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900">{quote.client.name}</p>
              </div>
              {quote.client.phone && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Telefone:</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{quote.client.phone}</p>
                </div>
              )}
              {quote.client.document && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">CPF/CNPJ:</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{quote.client.document}</p>
                </div>
              )}
              {quote.client.address && (
                <div className="sm:col-span-2">
                  <p className="text-xs sm:text-sm text-gray-600">Endereço:</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{quote.client.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4 sm:mb-6 overflow-x-auto">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Serviços</h3>
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-700 p-1.5 sm:p-2 text-left text-xs sm:text-sm">Serviço</th>
                  <th className="border border-gray-700 p-1.5 sm:p-2 text-center w-16 sm:w-24 text-xs sm:text-sm">Qtd.</th>
                  <th className="border border-gray-700 p-1.5 sm:p-2 text-center w-16 sm:w-24 text-xs sm:text-sm">Unid.</th>
                  <th className="border border-gray-700 p-1.5 sm:p-2 text-right w-24 sm:w-32 text-xs sm:text-sm">Valor Unit.</th>
                  <th className="border border-gray-700 p-1.5 sm:p-2 text-right w-24 sm:w-32 text-xs sm:text-sm">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 p-1.5 sm:p-2">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.serviceName}</p>
                      {item.category && (
                        <p className="text-[10px] sm:text-xs text-gray-600">
                          {item.category} / {item.subcategory}
                        </p>
                      )}
                    </td>
                    <td className="border border-gray-300 p-1.5 sm:p-2 text-center text-xs sm:text-sm">{item.qty}</td>
                    <td className="border border-gray-300 p-1.5 sm:p-2 text-center text-xs sm:text-sm">{item.unit}</td>
                    <td className="border border-gray-300 p-1.5 sm:p-2 text-right text-xs sm:text-sm">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="border border-gray-300 p-1.5 sm:p-2 text-right text-xs sm:text-sm font-semibold">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <div className="w-full sm:w-3/4 md:w-1/2">
              <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4 bg-gray-50 rounded">
                <div className="flex justify-between text-gray-900 text-sm sm:text-base">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between text-red-600 text-sm sm:text-base">
                    <span>Desconto:</span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                )}
                {quote.taxes > 0 && (
                  <div className="flex justify-between text-gray-900 text-sm sm:text-base">
                    <span>Impostos/Taxas:</span>
                    <span>+ {formatCurrency(quote.taxes)}</span>
                  </div>
                )}
                {quote.travelFee > 0 && (
                  <div className="flex justify-between text-gray-900 text-sm sm:text-base">
                    <span>Taxa de Deslocamento:</span>
                    <span>+ {formatCurrency(quote.travelFee)}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-800 pt-2 flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Observations */}
          {quote.observations && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2">Observações:</h3>
              <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">{quote.observations}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="text-xs sm:text-sm text-gray-600">
                <p className="font-semibold text-gray-900">Validade:</p>
                <p>{quote.validity} dias a partir da data de emissão</p>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 text-left sm:text-right">
                <p className="font-semibold text-gray-900">Condições de Pagamento:</p>
                <p>A combinar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 pt-6 sm:pt-8">
              <div className="border-t border-gray-400 pt-2">
                <p className="text-center text-xs sm:text-sm text-gray-600">Assinatura do Cliente</p>
              </div>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-center text-xs sm:text-sm text-gray-600">
                  {company.name} - {company.owner}
                </p>
              </div>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4">
              <p>Obrigado pela preferência!</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
