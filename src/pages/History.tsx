import { useState } from 'react';
import { FileText, Search, Eye, Edit, Copy, Download, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate } from '@/lib/utils-format';

export default function History() {
  const { quotes, deleteQuote } = useData();
  const [search, setSearch] = useState('');

  const filteredQuotes = quotes.filter(quote =>
    quote.osNumber.toLowerCase().includes(search.toLowerCase()) ||
    quote.client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Orçamentos</h1>
          <p className="text-muted-foreground">Visualize e gerencie todos os orçamentos</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nº OS ou cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quotes List */}
        <div className="space-y-3">
          {filteredQuotes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {search ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento criado ainda'}
              </CardContent>
            </Card>
          ) : (
            filteredQuotes.map(quote => (
              <Card key={quote.id} className="hover:shadow-md transition-smooth">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{quote.osNumber}</h3>
                        <Badge variant={quote.status === 'finalized' ? 'default' : 'secondary'}>
                          {quote.status === 'finalized' ? 'Finalizado' : 'Rascunho'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{quote.client.name}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="text-muted-foreground">
                          {formatDate(quote.date)}
                        </span>
                        <span className="text-muted-foreground">
                          {quote.items.length} serviço(s)
                        </span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(quote.total)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" title="Visualizar">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Duplicar">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Compartilhar">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Excluir"
                        onClick={async () => {
                          if (confirm('Deseja realmente excluir este orçamento?')) {
                            await deleteQuote(quote.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
