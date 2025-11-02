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
        <div className="flex items-center justify-between print:hidden">
          <Link to="/history">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button onClick={handleDownloadPDF} disabled={isGenerating}>
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Baixar PDF'}
            </Button>
          </div>
        </div>

        {/* PDF Preview Content */}
        <div
          id="pdf-preview-content"
          className="bg-white text-black p-8 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto print:shadow-none print:max-w-none"
        >
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                {company.logoDataUrl && (
                  <img
                    src={company.logoDataUrl}
                    alt={company.name}
                    className="h-16 mb-3 object-contain"
                  />
                )}
                <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-gray-700 font-medium">{company.owner}</p>
                {company.phone && <p className="text-gray-600">{company.phone}</p>}
                {company.email && <p className="text-gray-600">{company.email}</p>}
                {company.address && <p className="text-gray-600">{company.address}</p>}
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ORÇAMENTO / ORDEM DE SERVIÇO
                </h2>
                <p className="text-xl font-semibold text-gray-700">{quote.osNumber}</p>
                <p className="text-gray-600">Data: {formatDate(quote.date)}</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Dados do Cliente</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Nome:</p>
                <p className="font-semibold text-gray-900">{quote.client.name}</p>
              </div>
              {quote.client.phone && (
                <div>
                  <p className="text-sm text-gray-600">Telefone:</p>
                  <p className="font-semibold text-gray-900">{quote.client.phone}</p>
                </div>
              )}
              {quote.client.document && (
                <div>
                  <p className="text-sm text-gray-600">CPF/CNPJ:</p>
                  <p className="font-semibold text-gray-900">{quote.client.document}</p>
                </div>
              )}
              {quote.client.address && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Endereço:</p>
                  <p className="font-semibold text-gray-900">{quote.client.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Serviços</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-700 p-2 text-left">Serviço</th>
                  <th className="border border-gray-700 p-2 text-center w-24">Qtd.</th>
                  <th className="border border-gray-700 p-2 text-center w-24">Unid.</th>
                  <th className="border border-gray-700 p-2 text-right w-32">Valor Unit.</th>
                  <th className="border border-gray-700 p-2 text-right w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 p-2">
                      <p className="font-semibold text-gray-900">{item.serviceName}</p>
                      {item.category && (
                        <p className="text-xs text-gray-600">
                          {item.category} / {item.subcategory}
                        </p>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">{item.qty}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.unit}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right font-semibold">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-full md:w-1/2">
              <div className="space-y-2 p-4 bg-gray-50 rounded">
                <div className="flex justify-between text-gray-900">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Desconto:</span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                )}
                {quote.taxes > 0 && (
                  <div className="flex justify-between text-gray-900">
                    <span>Impostos/Taxas:</span>
                    <span>+ {formatCurrency(quote.taxes)}</span>
                  </div>
                )}
                {quote.travelFee > 0 && (
                  <div className="flex justify-between text-gray-900">
                    <span>Taxa de Deslocamento:</span>
                    <span>+ {formatCurrency(quote.travelFee)}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-800 pt-2 flex justify-between text-xl font-bold text-gray-900">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Observations */}
          {quote.observations && (
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Observações:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{quote.observations}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-900">Validade:</p>
                <p>{quote.validity} dias a partir da data de emissão</p>
              </div>
              <div className="text-sm text-gray-600 text-right">
                <p className="font-semibold text-gray-900">Condições de Pagamento:</p>
                <p>A combinar</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="border-t border-gray-400 pt-2">
                <p className="text-center text-sm text-gray-600">Assinatura do Cliente</p>
              </div>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-center text-sm text-gray-600">
                  {company.name} - {company.owner}
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4">
              <p>Obrigado pela preferência!</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
